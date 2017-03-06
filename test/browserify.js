var run = require('tape-run')
var browserify = require('browserify')

browserify(__dirname + '/index.js')
  .bundle()
  .pipe(run())
  .on('results', console.log)
  .pipe(process.stdout)
