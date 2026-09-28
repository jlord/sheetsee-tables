var Sheetsee = require('../index.js')
var parseCSV = require('./csv.js')
var status = document.getElementById('status')
var source = document.getElementById('csvSource')
var csvURL = new window.URLSearchParams(window.location.search).get('csv') || 'data.csv'

source.value = csvURL

// Submitting the source form reloads the page. Each page initializes one table
// and its event listeners once, matching the library's single-table API.
Promise.resolve().then(function () {
  var url = new window.URL(csvURL, window.location.href)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Serve the example over HTTP and use an HTTP or HTTPS CSV URL.')
  }
  return window.fetch(url.href, {credentials: 'omit'})
}).then(function (response) {
  if (!response.ok) throw new Error('CSV request failed with HTTP ' + response.status + '.')
  return response.text()
}).then(function (text) {
  var rows = parseCSV(text)
  var options = {
    data: rows,
    pagination: 2,
    tableDiv: '#exampleTable',
    filterDiv: '#tableFilter',
    templateID: 'exampleTable_template'
  }
  Sheetsee.makeTable(options)
  Sheetsee.initiateTableFilter(options)
  document.getElementById('tableFilter').disabled = false
  document.getElementById('clearFilter').disabled = false
  status.textContent = 'Loaded ' + rows.length + ' rows from CSV.'
}).catch(function (error) {
  status.setAttribute('role', 'alert')
  status.textContent = 'Could not load the table. ' + error.message +
    ' Check the CSV address and headers. For a remote file, its server must allow cross-origin requests.'
})
