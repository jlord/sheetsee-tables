var ich = require('icanhaz')
// TODO Finish linting by fixing vars
module.exports.initiateTableFilter = function (opts) {
  $('.clear').on('click', function () {
    $(this.id + '.noMatches').css('visibility', 'hidden')
    $(this.id + opts.filterDiv).val('')
    makeTable(opts)
  })
  $(opts.filterDiv).keyup(function (e) {
    var text = $(e.target).val()
    searchTable(opts, text)
  })
}

module.exports.searchTable = searchTable
function searchTable (opts, searchTerm) {
  var filteredList = []
  opts.data.forEach(function (object) {
    var stringObject = JSON.stringify(object).toLowerCase()
    if (stringObject.match(searchTerm.toLowerCase())) filteredList.push(object)
  })
  if (filteredList.length === 0) {
    $('.noMatches').css('visibility', 'inherit')
    makeTable(opts, filteredList)
  } else {
    $('.noMatches').css('visibility', 'hidden')
    makeTable(opts, filteredList)
  }
}
module.exports.sortThings = sortThings
function sortThings (opts, sorter, sorted, tableDiv) {
  if (opts.tableDiv !== tableDiv) return
  opts.data.sort(function (a, b) {
    if (a[sorter] < b[sorter]) return -1
    if (a[sorter] > b[sorter]) return 1
    return 0
  })
  if (sorted === 'descending') opts.data.reverse()
  makeTable(opts)
  var header
  $(tableDiv + ' .tHeader').each(function (i, el) {
    var contents = resolveDataTitle($(el).text())
    if (contents === sorter) header = el
  })
  $(header).attr('data-sorted', sorted)
}

module.exports.resolveDataTitle = resolveDataTitle
function resolveDataTitle (string) {
  var adjusted = string.toLowerCase().replace(/\s/g, '').replace(/\W/g, '')
  return adjusted
}

module.exports.initiateTableSorter = initiateTableSorter
function initiateTableSorter (options) {
  $(document).on('click', '.tHeader', sendToSort)

  function sendToSort (event) {
    var tableDiv = '#' + $(event.target).closest('div').attr('id')
    var sorted = $(event.target).attr('data-sorted')
    if (sorted) {
      if (sorted === 'descending') sorted = 'ascending'
      else sorted = 'descending'
    } else { sorted = 'ascending' }
    var sorter = resolveDataTitle(event.target.innerHTML)
    var sortInfo = {'sorter': sorter, 'sorted': sorted, 'tableDiv': tableDiv}
    sortThings(options, sorter, sorted, tableDiv)
  }
}

module.exports.makeTable = makeTable
function makeTable (opts, filteredList) {
  opts.templateID = opts.tableDiv + '_template'
  initiateTableSorter(opts)

  if (filteredList) var data = filteredList
  else var data = opts.data
  var tableId = opts.tableDiv.slice(1)
  if (!opts.pagination) table(data, {'tableDiv': '#' + opts.targetDiv})
  var allRows = data.length
  var totalPages = Math.ceil(allRows / opts.pagination)
  var currentPage = 1
  var currentStart = (currentPage * opts.pagination) - opts.pagination
  var currentEnd = currentPage * opts.pagination
  var currentRows = data.slice(currentStart, currentEnd)
  table(currentRows, opts)
  if (opts.data.length > opts.pagination) writePreNext(opts.tableDiv, currentPage, currentPage, totalPages, data, opts.pagination)
}

module.exports.setPagClicks = setPagClicks
function setPagClicks (data, tableId, currentPage, pagination, totalPages) {
  $('.pagination-pre-' + tableId).addClass('no-pag')

  $(document).on('click', ('.pagination-next-' + tableId), function () {
    if ($(this).hasClass('no-pag')) return

    currentPage = currentPage + 1
    var nextPage = currentPage + 1
    currentStart = (currentPage * pagination) - pagination
    currentEnd = currentPage * pagination

    if (currentPage >= totalPages) {
      currentRows = data.slice(currentStart, currentEnd)
      table(currentRows, {'tableDiv': '#' + tableId})
      setPreNext('#' + tableId, currentPage, currentPage, totalPages)
      $('.pagination-next-' + tableId).addClass('no-pag')
      $('.pagination-next-' + tableId)
    } else {
      currentRows = data.slice(currentStart, currentEnd)
      table(currentRows, {'tableDiv': '#' + tableId})
      setPreNext('#' + tableId, currentPage, currentPage, totalPages)
    }
  })

  $(document).on('click', ('.pagination-pre-' + tableId), function () {
    if (currentPage > 1) $(this).removeClass('no-pag')
    if ($(this).hasClass('no-pag')) return

    // if ((currentPage) === 2) {
    //   $(".pagination-pre-" + tableId).addClass("no-pag"); console.log("on page one!", currentPage)
    // }

    currentPage = currentPage - 1
    var nextPage = currentPage + 1
    currentStart = (currentPage * pagination) - pagination
    currentEnd = currentPage * pagination

    // currentRows = data.slice(currentStart, currentEnd)
    // table(currentRows, "#" + tableId)
    // setPreNext("#" + tableId, currentPage, currentPage, totalPages)

    if (currentPage === 1) {
      currentRows = data.slice(currentStart, currentEnd)
      table(currentRows, {'tableDiv': '#' + tableId})
      setPreNext('#' + tableId, currentPage, currentPage, totalPages)
      $('.pagination-pre-' + tableId).addClass('no-pag')
    } else {
      currentRows = data.slice(currentStart, currentEnd)
      table(currentRows, {'tableDiv': '#' + tableId})
      setPreNext('#' + tableId, currentPage, currentPage, totalPages)
    }
  })
}

module.exports.setPreNext = setPreNext
function setPreNext (targetDiv, currentPage, currentPage1, totalPages, data, pagination) {
  var tableId = targetDiv.slice(1)
  $(targetDiv).append("<div id='Pagination' pageno='" + currentPage + "'" + "class='table-pagination'>Showing page "
    + currentPage + ' of ' + totalPages + " <a class='pagination-pre-" + tableId + "'>Previous</a>" +
    " <a class='pagination-next-" + tableId + "'>Next</a></p></div>")
}

module.exports.writePreNext = writePreNext
function writePreNext (targetDiv, currentPage, currentPage1, totalPages, data, pagination) {
  var tableId = targetDiv.slice(1)
  $(targetDiv).append("<div id='Pagination' pageno='" + currentPage + "'" + "class='table-pagination'>Showing page "
    + currentPage + ' of ' + totalPages + " <a class='pagination-pre-" + tableId + "'>Previous</a>" +
    " <a class='pagination-next-" + tableId + "'>Next</a></p></div>")
  setPagClicks(data, tableId, currentPage, pagination, totalPages)
}

module.exports.clearPreNext = clearPreNext
function clearPreNext () {
  $('.table-pagination').attr('display', 'none')
}

module.exports.table = table
function table (data, opts) {
  var templateID = ''
  if (opts.templateID) {
    templateID = opts.templateID.replace('#', '')
  } else {
    templateID = opts.tableDiv.replace('#', '') + '_template'
  }
  var template = $(templateID)
  var tableContents = ich[templateID]({rows: data})
  $(opts.tableDiv).html(tableContents)
}
