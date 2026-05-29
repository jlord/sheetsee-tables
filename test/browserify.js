var fs = require('fs')
var browserify = require('browserify')
var path = require('path')

browserify(path.join(__dirname, 'set.js'))
  .bundle()
  .pipe(fs.createWriteStream(path.join(__dirname, 'sheetsee.js')))
