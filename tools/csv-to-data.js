var fs = require('fs')
var path = require('path')
var TextDecoder = require('util').TextDecoder

// Spreadsheet CSV: commas, doubled quotes and quoted newlines. Values stay
// strings, as required by the table's existing sorter.
function parseCSV (text) {
  text = text.replace(/^\uFEFF/, '')
  var records = []
  var record = []
  var field = ''
  var quoted = false
  var closedQuote = false
  var recordStarted = false
  function endField () {
    record.push(field)
    field = ''
    closedQuote = false
  }
  function endRecord () {
    endField()
    if (recordStarted) records.push(record)
    record = []
    recordStarted = false
  }
  for (var i = 0; i < text.length; i++) {
    var c = text[i]
    if (quoted) {
      if (c !== '"') field += c
      else if (text[i + 1] === '"') { field += '"'; i++ } else { quoted = false; closedQuote = true }
    } else if (c === ',') { recordStarted = true; endField() } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      endRecord()
    } else if (closedQuote) throw new Error('Unexpected text after a closing CSV quote')
    else if (c === '"') {
      if (field !== '') throw new Error('A CSV quote must start a field')
      quoted = true
      recordStarted = true
    } else { field += c; recordStarted = true }
  }
  if (quoted) throw new Error('Unclosed CSV quote')
  if (field !== '' || record.length || closedQuote) endRecord()
  if (!records.length) throw new Error('CSV needs a header row')
  var headers = records.shift()
  headers.forEach(function (header, index) {
    if (!header.trim()) throw new Error('Column names must not be empty')
    if (headers.indexOf(header) !== index) throw new Error('Duplicate column name: ' + header)
    if (['__proto__', 'constructor', 'prototype'].indexOf(header) !== -1) throw new Error('Unsupported column name: ' + header)
  })
  return records.map(function (values, index) {
    if (values.length !== headers.length) throw new Error('CSV record ' + (index + 2) + ' has ' + values.length + ' fields; expected ' + headers.length)
    var row = {}
    headers.forEach(function (header, column) { row[header] = values[column] })
    return row
  })
}

module.exports = parseCSV
if (require.main === module) {
  try {
    if (process.argv.length !== 4) throw new Error('Usage: node tools/csv-to-data.js input.csv output.json')
    var input = path.resolve(process.argv[2])
    var output = path.resolve(process.argv[3])
    if (input === output) throw new Error('Input and output must be different files')
    var inputFile = fs.statSync(input)
    var outputFile
    try { outputFile = fs.statSync(output) } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    // Different path strings may refer to one file (case aliases or hardlinks).
    // stat follows symlinks, so those aliases are covered too.
    if (outputFile && inputFile.dev === outputFile.dev && inputFile.ino === outputFile.ino) {
      throw new Error('Input and output must be different files')
    }
    var text = new TextDecoder('utf-8', {fatal: true}).decode(fs.readFileSync(input))
    var rows = parseCSV(text)
    // Parse completely before touching an existing output file.
    fs.writeFileSync(output, JSON.stringify(rows, null, 2) + '\n')
    console.log('Wrote ' + rows.length + ' rows to ' + process.argv[3])
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
