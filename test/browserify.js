var fs = require('fs')
var path = require('path')
var browserify = require('browserify')

browserify(path.join(__dirname, 'set.js'))
  .bundle()
  .pipe(fs.createWriteStream(path.join(__dirname, 'sheetsee.js')))
