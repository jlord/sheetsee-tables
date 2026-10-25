var fs = require('fs')
var path = require('path')
var browserify = require('browserify')
var readme = fs.readFileSync(path.join(__dirname, '../README.md'), 'utf8').replace(/\r\n/g, '\n')
var example = readme.match(/```html\n([\s\S]*?)\n```/)
if (!example) throw new Error('README copyable HTML example is missing')
fs.writeFileSync(path.join(__dirname, 'readme-example.html'), example[1] + '\n')

browserify(path.join(__dirname, 'set.js'))
  .bundle()
  .on('error', function (error) {
    console.error(error.message)
    process.exitCode = 1
  })
  .pipe(fs.createWriteStream(path.join(__dirname, 'sheetsee.js')))
