var assert = require('assert')
var fs = require('fs')
var path = require('path')
var parseCSV = require('../example/csv.js')
var count = 0

function test (name, check) {
  check()
  count++
  console.log('ok - ' + name)
}

test('the supplied spreadsheet produces all five rows and string ratings', function () {
  var rows = parseCSV(fs.readFileSync(path.join(__dirname, '../example/data.csv'), 'utf8'))
  assert.strictEqual(rows.length, 5)
  assert.deepStrictEqual(rows[0], {Animal: 'Cat', Name: 'Liza', Rating: '10'})
  assert.strictEqual(rows[4].Name, 'Trisana')
})

test('quoted commas, escaped quotes and embedded newlines remain cell content', function () {
  assert.deepStrictEqual(parseCSV('Animal,Name,Rating\r\nDog,"Boo, ""the dog""\nJr.",9\r\n'), [
    {Animal: 'Dog', Name: 'Boo, "the dog"\nJr.', Rating: '9'}
  ])
})

test('UTF-8 BOM, reordered columns and empty lines are accepted', function () {
  assert.deepStrictEqual(parseCSV('\ufeffName,Rating,Animal\n\nSam,10,Dog\n'), [
    {Animal: 'Dog', Name: 'Sam', Rating: '10'}
  ])
})

test('a header-only spreadsheet gives an empty table', function () {
  assert.deepStrictEqual(parseCSV('Animal,Name,Rating\n'), [])
})

test('missing, duplicate and miscapitalized headers fail clearly', function () {
  ;['', 'Animal,Name\nCat,Liza', 'Animal,Name,Name\nCat,Liza,10', 'animal,Name,Rating\nCat,Liza,10'].forEach(function (csv) {
    assert.throws(function () { parseCSV(csv) }, /header row/)
  })
})

test('too few or too many fields fail instead of shifting cells', function () {
  ;['Animal,Name,Rating\nDog,Sam', 'Animal,Name,Rating\nDog,Sam,10,extra'].forEach(function (csv) {
    assert.throws(function () { parseCSV(csv) }, /row 2 must contain 3 fields/)
  })
})

test('unterminated quoted cells fail instead of returning partial data', function () {
  assert.throws(function () { parseCSV('Animal,Name,Rating\nDog,"Sam,10') }, /quoted field/)
})

console.log(count + ' CSV checks passed')
