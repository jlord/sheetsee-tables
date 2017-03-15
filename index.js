var Mustache = require('mustache')
var tblOpts = {}

// Only called the very first time
function makeTable (data) {
  tblOpts = data
  tblOpts.sortMeta = {}
  tblOpts.paginationMeta = {}

  if (!tblOpts.templateID) {
    tblOpts.templateID = tblOpts.tableDiv.replace('#', '') + '_template'
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
  prepTable()
}

// Prep the data and pagination for the table
function prepTable (filteredList) {
  var data = filteredList || tblOpts.data

  // If they don't specifiy pagination, draw table with everything
  if (!tblOpts.pagination) return updateTable(data)

  // Create Pagination Metadata
  // Build the table with paginated data
  // Append pagination DOM elements

  updateTable(data)
}

function updateTable (data) {
  var rawTemplate = document.getElementById(tblOpts.templateID).innerHTML
  var content = Mustache.render(rawTemplate, {rows: data})
  document.getElementById(tblOpts.tableDiv.replace('#', '')).innerHTML = content
}
module.exports.makeTable = makeTable
// module.exports.initiateTableFilter = initiateTableFilter
