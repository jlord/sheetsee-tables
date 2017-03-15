var Mustache = require('mustache')
var tableOptions = {}

// Only called the very first time
function makeTable (data, filteredList) {
  tableOptions = data
  tableOptions.sortMeta = {}
  tableOptions.paginationMeta = {}

  if (!tableOptions.templateID) {
    tableOptions.templateID = tableOptions.tableDiv.replace('#', '') + '_template'
  }
  actuallyMakeTable(filteredList)
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
  actuallyMakeTable()
}

// Called each time table is redrawn
function actuallyMakeTable (filteredList) {
  var data = filteredList || tableOptions.data

  // If they don't specifiy pagination,
  // draw one table with everything
  if (!tableOptions.pagination) {
    return updateTable(data, {'tableDiv': '#' + tableOptions.targetDiv})
  }

  buildPagination(data, tableOptions.pagination)
  updateTable(tableOptions.paginationMeta.currentRows)

  if (tableOptions.data.length > tableOptions.pagination) {
    updatePreNext(data)
    setPagClicks(data)
  }
}

function updatePreNext (data) {
  var tableId = tableOptions.tableDiv.slice(1)
  var prenext = document.createElement('div')
  prenext.setAttribute('id', 'Pagination')
  prenext.setAttribute('pageno', tableOptions.paginationMeta.currentPage)
  prenext.classList.add('table-pagination')
  prenext.innerHTML = 'Showing page ' + tableOptions.paginationMeta.currentPage + ' of ' + tableOptions.paginationMeta.totalPages + " <a class='pagination-pre-" + tableId + "'>Previous</a>" + " <a class='pagination-next-" + tableId + "'>Next</a></div>"
  document.getElementById(tableId).append(prenext)
}

function setPagClicks (data) {
  var tableId = tableOptions.tableDiv.slice(1)
  document.querySelector('.pagination-pre-' + tableId).classList.add('no-pag')

  // Add listeners
  nextListener(data)
  preListener(data)
}

function updatePagCounts (direction) {
  var pag = tableOptions.paginationMeta
  pag.currentPage = pag.currentPage + direction
  pag.nextPage = pag.currentPage + 1
  pag.currentStart = (pag.currentPage * tableOptions.pagination) - tableOptions.pagination
  pag.currentEnd = pag.currentPage * tableOptions.pagination
}

function updatePages (data) {
  var tableId = tableOptions.tableDiv.slice(1)
  var pag = tableOptions.paginationMeta

  pag.currentRows = data.slice(pag.currentStart, pag.currentEnd)
  updateTable(pag.currentRows)
  updatePreNext(data)

  // On the last page
  if (pag.currentPage === pag.totalPages) {
    document.querySelector('.pagination-next-' + tableId).classList.add('no-pag')
    document.querySelector('.pagination-pre-' + tableId).classList.remove('no-pag')
  }
  // On the first page
  if (pag.currentPage === 1) {
    document.querySelector('.pagination-pre-' + tableId).classList.add('no-pag')
    document.querySelector('.pagination-next-' + tableId).classList.remove('no-pag')
  }
}

function nextListener (data) {
  var tableId = tableOptions.tableDiv.slice(1)
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('pagination-next-' + tableId)) {
      if (event.target.classList.contains('no-pag')) return
      updatePagCounts(Number(1))
      updatePages(data)
    }
  })
}

function preListener (data) {
  var tableId = tableOptions.tableDiv.slice(1)
  document.body.addEventListener('click', function (event) {
    if (event.target.classList.contains('pagination-pre-' + tableId)) {
      if (event.target.classList.contains('no-pag')) return
      updatePagCounts(Number(-1))
      updatePages(data)
    }
  })
}

function buildPagination (data, pagination) {
  tableOptions.paginationMeta.allRows = data.length
  tableOptions.paginationMeta.totalPages = Math.ceil(tableOptions.paginationMeta.allRows / pagination)
  tableOptions.paginationMeta.currentPage = 1
  tableOptions.paginationMeta.currentStart = (tableOptions.paginationMeta.currentPage * pagination) - pagination
  tableOptions.paginationMeta.currentEnd = tableOptions.paginationMeta.currentPage * pagination
  tableOptions.paginationMeta.currentRows = data.slice(tableOptions.paginationMeta.currentStart, tableOptions.paginationMeta.currentEnd)
  return
}

function updateTable (data) {
  var rawTemplate = document.getElementById(tableOptions.templateID).innerHTML
  var content = Mustache.render(rawTemplate, {rows: data})
  document.getElementById(tableOptions.tableDiv.replace('#', '')).innerHTML = content
}

module.exports.makeTable = makeTable
// module.exports.initiateTableFilter = initiateTableFilter
