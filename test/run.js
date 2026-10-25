var assert = require('assert')
var fs = require('fs')
var os = require('os')
var path = require('path')
var spawnSync = require('child_process').spawnSync
var parse = require('../tools/csv-to-data')
var passed = 0
var failed = 0
function test (name, run) {
  try { run(); passed++; console.log('PASS ' + name) } catch (error) { failed++; console.error('FAIL ' + name + '\n' + error.stack) }
}
test('sample spreadsheet matches actual demo data', function () {
  assert.deepStrictEqual(parse(fs.readFileSync(path.join(__dirname, 'sample.csv'), 'utf8')), require('./data.json'))
})
test('numbers and leading zeros remain strings', function () { assert.deepStrictEqual(parse('Code,Value\n001,10'), [{Code: '001', Value: '10'}]) })
test('quoted commas and doubled quotes', function () { assert.deepStrictEqual(parse('Name,Place\n"A, B","The ""Cafe"""'), [{Name: 'A, B', Place: 'The "Cafe"'}]) })
test('quoted multiline cells', function () { assert.strictEqual(parse('Name\n"one\ntwo"')[0].Name, 'one\ntwo') })
test('CRLF records and final newline', function () { assert.deepStrictEqual(parse('Name,Value\r\nCat,1\r\n'), [{Name: 'Cat', Value: '1'}]) })
test('CR line endings', function () { assert.deepStrictEqual(parse('Name\rCat\r'), [{Name: 'Cat'}]) })
test('UTF8 BOM and Unicode', function () { assert.deepStrictEqual(parse('\uFEFFName\nSchönefeld 猫'), [{Name: 'Schönefeld 猫'}]) })
test('blank lines ignored', function () { assert.deepStrictEqual(parse('\nName\n\nCat\n\n'), [{Name: 'Cat'}]) })
test('empty cells preserved', function () { assert.deepStrictEqual(parse('A,B,C\n,cat,'), [{A: '', B: 'cat', C: ''}]) })
test('quoted empty single-column rows are not blank lines', function () { assert.deepStrictEqual(parse('Name\n""\n'), [{Name: ''}]) })
test('header-only data is empty', function () { assert.deepStrictEqual(parse('Name,Value\n'), []) })
test('HTML and formula-looking cells remain plain data', function () { assert.strictEqual(parse('Name\n"<img src=x onerror=alert(1)>"')[0].Name, '<img src=x onerror=alert(1)>'); assert.strictEqual(parse('Name\n=1+1')[0].Name, '=1+1') })
test('case and spaces inside values preserved', function () { assert.deepStrictEqual(parse('Name\n Cat '), [{Name: ' Cat '}]) })
;[
  ['missing header', '', /header/],
  ['empty column', 'A,,B\n1,2,3', /empty/],
  ['duplicate column', 'A,A\n1,2', /Duplicate/],
  ['short row', 'A,B\n1', /fields/],
  ['long row', 'A\n1,2', /fields/],
  ['unclosed quote', 'A\n"one', /Unclosed/],
  ['quote inside unquoted cell', 'A\none"two', /quote/],
  ['text after closing quote', 'A\n"one"two', /closing/],
  ['reserved object key', '__proto__\nvalue', /Unsupported/]
].forEach(function (entry) { test('rejects ' + entry[0], function () { assert.throws(function () { parse(entry[1]) }, entry[2]) }) })

var tempRoot = fs.realpathSync(os.tmpdir())
var directory = fs.mkdtempSync(path.join(tempRoot, 'sheetsee-csv-'))
var input = path.join(directory, 'sheet with spaces.csv')
var output = path.join(directory, 'output with spaces.json')
var cli = path.join(__dirname, '../tools/csv-to-data.js')
function run (args) { return spawnSync(process.execPath, [cli].concat(args), {encoding: 'utf8', timeout: 5000}) }
try {
  test('actual CLI converts a spaced path', function () {
    fs.writeFileSync(input, 'Name,Value\n"C++, [test]",001\n')
    var result = run([input, output])
    assert.strictEqual(result.status, 0, result.stderr)
    assert.deepStrictEqual(JSON.parse(fs.readFileSync(output, 'utf8')), [{Name: 'C++, [test]', Value: '001'}])
  })
  test('invalid CSV exits nonzero without overwriting output', function () {
    var before = fs.readFileSync(output)
    fs.writeFileSync(input, 'A,B\n1')
    var result = run([input, output])
    assert.strictEqual(result.status, 1)
    assert.match(result.stderr, /fields/)
    assert.deepStrictEqual(fs.readFileSync(output), before)
  })
  test('invalid UTF8 is rejected without overwriting output', function () {
    var before = fs.readFileSync(output)
    fs.writeFileSync(input, Buffer.from([65, 10, 255]))
    assert.strictEqual(run([input, output]).status, 1)
    assert.deepStrictEqual(fs.readFileSync(output), before)
  })
  test('same input/output path is rejected without modification', function () {
    fs.writeFileSync(input, 'Name\nCat')
    var before = fs.readFileSync(input)
    assert.strictEqual(run([input, input]).status, 1)
    assert.deepStrictEqual(fs.readFileSync(input), before)
  })
  test('case-variant output preserves input on the actual filesystem', function () {
    fs.writeFileSync(input, 'Name\nCat')
    var before = fs.readFileSync(input)
    var alias = path.join(directory, path.basename(input).toUpperCase())
    var isAlias = fs.existsSync(alias)
    var result = run([input, alias])
    assert.strictEqual(result.status, isAlias ? 1 : 0, result.stderr)
    if (isAlias) assert.match(result.stderr, /different files/)
    else assert.deepStrictEqual(JSON.parse(fs.readFileSync(alias, 'utf8')), [{Name: 'Cat'}])
    assert.deepStrictEqual(fs.readFileSync(input), before)
    console.log('  Filesystem case aliases: ' + (isAlias ? 'same file rejected' : 'distinct file allowed'))
  })
  test('hardlinked output is rejected without modifying either name', function () {
    fs.writeFileSync(input, 'Name\nCat')
    var before = fs.readFileSync(input)
    var alias = path.join(directory, 'same-input-link.csv')
    fs.linkSync(input, alias)
    var result = run([input, alias])
    assert.strictEqual(result.status, 1)
    assert.match(result.stderr, /different files/)
    assert.deepStrictEqual(fs.readFileSync(input), before)
    assert.deepStrictEqual(fs.readFileSync(alias), before)
  })
  test('usage errors return failure', function () { var result = run([]); assert.strictEqual(result.status, 1); assert.match(result.stderr, /Usage:/) })
  test('missing input does not create output', function () {
    var missingOutput = path.join(directory, 'missing.json')
    assert.strictEqual(run([path.join(directory, 'absent.csv'), missingOutput]).status, 1)
    assert.strictEqual(fs.existsSync(missingOutput), false)
  })
} finally {
  var target = fs.realpathSync(directory)
  assert.strictEqual(path.dirname(target), tempRoot)
  assert.ok(path.basename(target).indexOf('sheetsee-csv-') === 0)
  fs.rmSync(target, {recursive: true})
}
console.log(passed + ' passed; ' + failed + ' failed')
if (failed) process.exitCode = 1
