var Mustache = require('mustache')
var tableOptions = {}

// Only called the very first time
function makeTable (data, filteredList) {
  tableOptions = data
  tableOptions.sortMeta = {}

  if (!tableOptions.templateID) {
    tableOptions.templateID = tableOptions.tableDiv.replace('#', '') + '_template'
  }
  actuallyMakeTable(filteredList)
  initiateTableSorter()

}

// Called once to listen for clicks on table headers
function initiateTableSorter () {
  console.log("Initiate!")
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('tHeader')) {
      console.log("CLICKED", event.target.outerHTML)
      perpareSort(event)
    }
  })
}

// Prepare to be sorted
function perpareSort (event) {
  console.log("preparing to sort")
  if (!tableOptions.sortMeta.sorted || tableOptions.sortMeta.sorted === 'descending') {
    tableOptions.sortMeta.sorted = 'ascending'
  }
  else if (tableOptions.sortMeta.sorted = 'ascending') tableOptions.sortMeta.sorted = 'descending'
  // var sorted = event.target.getAttribute('data-sorted')
  // if (sorted === null || sorted === 'descending') sorted = 'ascending'
  // else sorted = 'descending'
  tableOptions.sortMeta.sortBy = event.target.innerHTML.replace(/\s/g, '').replace(/\W/g, '')
  tableOptions.tableDiv = '#' + event.target.closest('div').getAttribute('id')
  sortData(event)
}

// Sort the data
function sortData (event) {
  console.log("Sorting data")
  // clicked on a header of a table not built by SS
  // if (tableOptions.tableDiv !== tableOptions.sortMeta.tableDiv) return

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
  actuallyMakeTable()
}

// Called each time table is redrawn
function actuallyMakeTable (filteredList) {
  console.log('actually make table')
  // Are we redrawing with filtered data
  // var data
  // if (filteredList) data = filteredList
  // else data = tableOptions.data
  var data = filteredList || tableOptions.data

  // If they don't specifiy pagination,
  // draw one table with everything
  // if (!tableOptions.pagination) return table(data, {'tableDiv': '#' + tableOptions.targetDiv})
  return updateTable(data, tableOptions)

  // var paginationMeta = buildPagination(data, tableOptions.pagination)
  // table(paginationMeta.currentRows, tableOptions)

  // if (tableOptions.data.length > tableOptions.pagination) {
  //   writePreNext(tableOptions.tableDiv, currentPage, currentPage, totalPages, data, tableOptions.pagination)
  // }
}

function buildPagination (data, pagination) {
  var paginationMeta = {}
  paginationMeta.allRows = data.length
  paginationMeta.totalPages = Math.ceil(paginationMeta.allRows / pagination)
  paginationMeta.currentPage = 1
  paginationMeta.currentStart = (paginationMeta.currentPage * pagination) - pagination
  paginationMeta.currentEnd = paginationMeta.currentPage * pagination
  paginationMeta.currentRows = data.slice(paginationMeta.currentStart, paginationMeta.currentEnd)
  return paginationMeta
}

function updateTable (data, tableOptions) {
  console.log("Updating table")
  // console.log(tableOptions)
  var rawTemplate = document.getElementById(tableOptions.templateID).innerHTML
  var content = Mustache.render(rawTemplate, {rows: data})
  document.getElementById(tableOptions.tableDiv.replace('#', '')).innerHTML = content
}

module.exports.makeTable = makeTable
