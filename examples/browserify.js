var fs = require('fs')
var path = require('path')
var browserify = require('browserify')

browserify(path.join(__dirname, 'set.js'))
  .bundle()
  .on('error', function (err) {
    console.error(err.message)
    process.exit(1)
  })
  .pipe(fs.createWriteStream(path.join(__dirname, 'sheetsee-tables.js')))
