var Papa = require('papaparse')
var columns = ['Animal', 'Name', 'Rating']

// Keep values as strings: sheetsee-tables calls toLowerCase when sorting.
module.exports = function parseCSV (text) {
  var result = Papa.parse(text, {delimiter: ',', skipEmptyLines: true})
  if (result.errors.length) throw new Error('The CSV contains an invalid quoted field.')

  var headers = result.data.shift() || []
  if (headers.length !== columns.length || columns.some(function (column) {
    return headers.indexOf(column) === -1
  })) throw new Error('Use one header row with Animal, Name and Rating (matching capitalization).')

  return result.data.map(function (row, index) {
    if (row.length !== headers.length) {
      throw new Error('CSV row ' + (index + 2) + ' must contain ' + columns.length + ' fields.')
    }
    var item = {}
    columns.forEach(function (column) {
      item[column] = row[headers.indexOf(column)]
    })
    return item
  })
}
