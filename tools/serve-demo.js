var fs = require('fs')
var http = require('http')
var path = require('path')
var root = path.join(__dirname, '../test')
var port = Number(process.env.PORT || 8080)
var files = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/readme-example.html': ['readme-example.html', 'text/html; charset=utf-8'],
  '/sheetsee.js': ['sheetsee.js', 'text/javascript; charset=utf-8'],
  '/sample.csv': ['sample.csv', 'text/csv; charset=utf-8'],
  '/regressions.html': ['regressions.html', 'text/html; charset=utf-8'],
  '/browser-tests.js': ['browser-tests.js', 'text/javascript; charset=utf-8']
}
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535')
var server = http.createServer(function (request, response) {
  var entry = files[request.url]
  if (request.method !== 'GET' || !entry) { response.writeHead(404); response.end('Not found'); return }
  fs.readFile(path.join(root, entry[0]), function (error, data) {
    if (error) { response.writeHead(404); response.end('Run npm run bfy first'); return }
    response.writeHead(200, {
      'Content-Type': entry[1],
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; frame-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'"
    })
    response.end(data)
  })
})
server.on('error', function (error) { console.error(error.message); process.exitCode = 1 })
server.listen(port, '127.0.0.1', function () { console.log('Demo: http://127.0.0.1:' + port + ' (Ctrl+C to stop)') })
