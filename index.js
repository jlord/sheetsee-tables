var Mustache = require('mustache')
var tableOptions = {}

// Only called the very first time
function makeTable (data) {
  tableOptions = data
  tableOptions.sortMeta = {}
  tableOptions.paginationMeta = {}

  if (!tableOptions.templateID) {
    tableOptions.templateID = tableOptions.tableDiv.replace('#', '') + '_template'
  }

  prepTable()
  initiateTableSorter()
}

// Called once to listen for clicks on table headers
function initiateTableSorter () {
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('tHeader')) {
      perpareSort(event)
    }
  })
}

// Prepare to be sorted
function perpareSort (event) {
  if (!tableOptions.sortMeta.sorted || tableOptions.sortMeta.sorted === 'descending') {
    tableOptions.sortMeta.sorted = 'ascending'
  } else if (tableOptions.sortMeta.sorted === 'ascending') tableOptions.sortMeta.sorted = 'descending'

  tableOptions.sortMeta.sortBy = event.target.innerHTML.replace(/\s/g, '').replace(/\W/g, '')
  tableOptions.tableDiv = '#' + event.target.closest('div').getAttribute('id')
  sortData(event)
}

// Sort the data
function sortData (event) {
  tableOptions.data.sort(function (a, b) {
    var aa = a[tableOptions.sortMeta.sortBy]
    var bb = b[tableOptions.sortMeta.sortBy]
    aa = aa.match(/^[\d\.,]$/) ? Number(aa) : aa
    bb = bb.match(/^[\d\.,]$/) ? Number(bb) : bb

    if (aa < bb) return -1
    if (aa > bb) return 1
    return 0
  })
  if (tableOptions.sortMeta.sorted === 'descending') tableOptions.data.reverse()
  prepTable()
}

// Prep the data and pagination for the table
function prepTable (filteredList) {
  var data = filteredList || tableOptions.data

  // If they don't specifiy pagination, draw table with everything
  // if (!tableOptions.pagination) return updateTable(data)
  updateTable(data)
}

function updateTable (data) {
  var rawTemplate = document.getElementById(tableOptions.templateID).innerHTML
  var content = Mustache.render(rawTemplate, {rows: data})
  document.getElementById(tableOptions.tableDiv.replace('#', '')).innerHTML = content
}

module.exports.makeTable = makeTable
// module.exports.initiateTableFilter = initiateTableFilter
