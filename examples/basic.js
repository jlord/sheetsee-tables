var Sheetsee = require('../index.js')
var data = require('./basic-data')

document.addEventListener('DOMContentLoaded', function () {
  var tableOptions = {
    data: data,
    pagination: 3,
    tableDiv: '#siteTable',
    filterDiv: '#siteTableFilter'
  }

  Sheetsee.makeTable(tableOptions)
  Sheetsee.initiateTableFilter(tableOptions)
})
