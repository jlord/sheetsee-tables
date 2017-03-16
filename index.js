var Mustache = require('mustache')
var tblOpts = {}

// Only called the very first time
function makeTable (data) {
  tblOpts = data
  tblOpts.sortMeta = {}
  tblOpts.pgnMta = {}

  if (!tblOpts.templateID) {
    tblOpts.templateID = tblOpts.tableDiv.replace('#', '') + '_template'
  }

  buildPaginationMeta(data.data, data.pagination)

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
  if (!tblOpts.sortMeta.sorted || tblOpts.sortMeta.sorted === 'descending') {
    tblOpts.sortMeta.sorted = 'ascending'
  } else if (tblOpts.sortMeta.sorted === 'ascending') tblOpts.sortMeta.sorted = 'descending'

  tblOpts.sortMeta.sortBy = event.target.innerHTML.replace(/\s/g, '').replace(/\W/g, '')
  tblOpts.tableDiv = '#' + event.target.closest('div').getAttribute('id')
  sortData(event)
}

// Sort the data
function sortData (event) {
  tblOpts.data.sort(function (a, b) {
    var aa = a[tblOpts.sortMeta.sortBy]
    var bb = b[tblOpts.sortMeta.sortBy]
    aa = aa.match(/^[\d\.,]$/) ? Number(aa) : aa
    bb = bb.match(/^[\d\.,]$/) ? Number(bb) : bb

    if (aa < bb) return -1
    if (aa > bb) return 1
    return 0
  })
  if (tblOpts.sortMeta.sorted === 'descending') tblOpts.data.reverse()
  console.log("SORT!")
  // This table update doesn't change pagination; reset direction
  if (tblOpts.pgnMta.dir) tblOpts.pgnMta.dir = Number(0)
  prepTable()
}

// Prep the data and pagination for the table
function prepTable (filteredList) {
  var data = filteredList || tblOpts.data

  // If they don't specifiy pagination, draw table with everything
  if (!tblOpts.pagination) return updateTable(data)

  // Create Pagination Metadata
  // buildPaginationMeta(data, tblOpts.pagination)
  buildPaginationMeta(data)
  console.log(tblOpts.pgnMta)
  // Build the table with paginated data
  updateTable(tblOpts.pgnMta.crntRows)
  // Append pagination DOM elements
  addPaginationDOM()
}

function updateTable (data) {
  var rawTemplate = document.getElementById(tblOpts.templateID).innerHTML
  var content = Mustache.render(rawTemplate, {rows: data})
  document.getElementById(tblOpts.tableDiv.replace('#', '')).innerHTML = content
}

// PAGINATION

function buildPaginationMeta (data) {
  console.log('buildPagination data', data)
  var dir = tblOpts.pgnMta.dir || 0
  var current = tblOpts.pgnMta.crntPage || 1
  tblOpts.pgnMta.allRows = data.length
  tblOpts.pgnMta.totalPages = Math.ceil(tblOpts.pgnMta.allRows / tblOpts.pagination)
  tblOpts.pgnMta.crntPage = current + dir
  tblOpts.pgnMta.nextPage = tblOpts.pgnMta.crntPage - 1
  tblOpts.pgnMta.crntStart = (tblOpts.pgnMta.crntPage * tblOpts.pagination) - tblOpts.pagination
  tblOpts.pgnMta.crntEnd = tblOpts.pgnMta.crntPage * tblOpts.pagination
  tblOpts.pgnMta.crntRows = data.slice(tblOpts.pgnMta.crntStart, tblOpts.pgnMta.crntEnd)
  return
}

function addPaginationDOM () {
  var tblId = tblOpts.tableDiv.slice(1)
  var el = document.createElement('div')
  el.setAttribute('id', 'Pagination')
  el.setAttribute('pageno', tblOpts.pgnMta.crntPage)
  el.classList.add('table-pagination')
  el.innerHTML = 'Showing page ' + tblOpts.pgnMta.crntPage + ' of ' + tblOpts.pgnMta.totalPages + " <a class='pagination-pre-" + tblId + "'>Previous</a>" + " <a class='pagination-next-" + tblId + "'>Next</a></div>"
  document.getElementById(tblId).append(el)

  // On the last page
  if (tblOpts.pgnMta.crntPage >= tblOpts.pgnMta.totalPages) {
    document.querySelector('.pagination-next-' + tblId).classList.add('no-pag')
    document.querySelector('.pagination-pre-' + tblId).classList.remove('no-pag')
  }
  // On the first page
  if (tblOpts.pgnMta.crntPage === 1) {
    document.querySelector('.pagination-pre-' + tblId).classList.add('no-pag')
    document.querySelector('.pagination-next-' + tblId).classList.remove('no-pag')
  }
  // Listen for next clicks
  document.querySelector('.pagination-next-' + tblId).addEventListener('click', function (e) {
    console.log("CLICKED NEXT")
    if (e.target.classList.contains('no-pag')) return
    tblOpts.pgnMta.dir = Number(1)
    console.log(tblOpts.pgnMta.dir)
    // build table
    prepTable()
  })
  // Listen for previous clicks
  document.querySelector('.pagination-pre-' + tblId).addEventListener('click', function (e) {
    console.log("CLICKED PRE")
    tblOpts.pgnMta.dir = Number(-1)
    console.log(tblOpts.pgnMta.dir)
    if (e.target.classList.contains('no-pag')) return
    // build table
    prepTable()
  })
}

module.exports.makeTable = makeTable
// module.exports.initiateTableFilter = initiateTableFilter
