var Mustache = require('mustache')

// Only called the very first time
function makeTable (opts, filteredList) {
  console.log("First opts", opts)
  if (!opts.templateID) {
    opts.templateID = opts.tableDiv.replace('#', '') + '_template'
  }
  // TODO check to see if they are using sorters
  // initiateTableSorter(opts)
  actuallyMakeTable(opts, filteredList)
}

// Called each time table is redrawn
function actuallyMakeTable (opts, filteredList) {
  console.log("actuallyMakeTable", opts)
  // Are we redrawing with filtered data
  if (filteredList) var data = filteredList
  else var data = opts.data

  var tableId = opts.tableDiv.slice(1)

  // If they don't specifiy pagination,
  // draw one table with everything
  // if (!opts.pagination) return table(data, {'tableDiv': '#' + opts.targetDiv})
  return updateTable(data, opts)


  // var paginationMeta = buildPagination(data, opts.pagination)
  // table(paginationMeta.currentRows, opts)

  // if (opts.data.length > opts.pagination) {
  //   writePreNext(opts.tableDiv, currentPage, currentPage, totalPages, data, opts.pagination)
  // }
}

function buildPagination (data, pagination) {
  var paginationMeta = {}
  paginationMeta.allRows = data.length
  paginationMeta.totalPages = Math.ceil(allRows / pagination)
  paginationMeta.currentPage = 1
  paginationMeta.currentStart = (currentPage * pagination) - pagination
  paginationMeta.currentEnd = currentPage * pagination
  paginationMeta.currentRows = data.slice(currentStart, currentEnd)
  return paginationMeta
}

function updateTable (data, opts) {
  console.log("updating DOM now")
  var rawTemplate = document.getElementById(opts.templateID).innerHTML
  var content = Mustache.render(rawTemplate, {rows: data} )
  document.getElementById(opts.tableDiv.replace('#', '')).innerHTML = content
}

module.exports.makeTable = makeTable
