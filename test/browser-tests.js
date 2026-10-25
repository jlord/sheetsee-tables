/* global window, document */
var passed = 0
var failed = 0
function check (name, condition) {
  var row = document.createElement('li')
  row.textContent = (condition ? 'PASS ' : 'FAIL ') + name
  document.getElementById('results').appendChild(row)
  if (condition) passed++
  else failed++
}
function load (url, custom) {
  return new Promise(function (resolve, reject) {
    var frame = document.createElement('iframe')
    frame.title = 'Isolated table regression'
    frame.style.display = 'none'
    var timeout = window.setTimeout(function () { reject(new Error('Frame did not load: ' + url)) }, 5000)
    frame.onload = function () {
      window.clearTimeout(timeout)
      var w = frame.contentWindow
      w.errors = []
      w.addEventListener('error', function (event) { w.errors.push(event.message); event.preventDefault() })
      resolve({frame: frame, w: w, doc: w.document})
    }
    if (custom) frame.srcdoc = '<script src="./sheetsee.js"></script><input id="filter"><button class="clear">Clear</button><div id="table"></div><script id="table_template" type="text/html"><table><tr><th class="tHeader">Name</th></tr>{{#rows}}<tr><td>{{Name}}</td></tr>{{/rows}}</table></script>'
    else frame.src = url
    document.body.appendChild(frame)
  })
}
function count (f) { return f.doc.querySelectorAll('td:first-child').length }
function values (f) { return Array.prototype.map.call(f.doc.querySelectorAll('td:nth-child(2)'), function (cell) { return cell.textContent }).join(',') }
function search (f, selector, term) {
  var input = f.doc.querySelector(selector)
  input.value = term
  input.dispatchEvent(new f.w.KeyboardEvent('keyup', {bubbles: true}))
}
function click (f, selector) { f.doc.querySelector(selector).click() }
load('/index.html').then(function (f) {
  check('demo renders two of five rows', count(f) === 2 && f.doc.getElementById('status').textContent === '5 spreadsheet rows loaded.')
  check('preview equals actual bundled table input', f.doc.getElementById('dataPreview').textContent === JSON.stringify(f.w.data, null, 2))
  check('initial pagination is page1 of3', /page 1 of 3/.test(f.doc.getElementById('Pagination').textContent))
  click(f, '.pagination-next-fullTable'); check('next page has correct rows', values(f) === 'Sam,Snowy')
  click(f, '.pagination-next-fullTable'); check('last page has one row', values(f) === 'Trisana')
  click(f, '.pagination-next-fullTable'); check('last-page next is inert', values(f) === 'Trisana')
  search(f, '#fullTableFilter', 'dOg'); check('case-insensitive search resets pagination', values(f) === 'Boo,Sam' && /Page 1 of 1/.test(f.doc.getElementById('Pagination').textContent))
  click(f, 'th:nth-child(2)'); check('sort keeps filtered rows', values(f) === 'Boo,Sam')
  click(f, '.clear'); check('clear restores rows after filtering', count(f) === 2 && f.doc.getElementById('fullTableFilter').value === '')
  click(f, 'th:nth-child(2)'); check('name descending sort works', values(f) === 'Trisana,Snowy')
  click(f, 'th:nth-child(2)'); check('name ascending sort works', values(f) === 'Boo,Liza')
  ;['nothing-matches', '[', 'C++'].forEach(function (term) {
    search(f, '#fullTableFilter', term)
    check('literal no-match search ' + JSON.stringify(term), count(f) === 0 && /No results/.test(f.doc.getElementById('Pagination').textContent) && f.w.errors.length === 0)
    click(f, '.clear'); search(f, '#fullTableFilter', 'Liza')
    check('clear and valid search recover after ' + JSON.stringify(term), values(f) === 'Liza')
  })
  check('demo has no uncaught errors', f.w.errors.length === 0)
  f.frame.remove()
  return load('/readme-example.html')
}).then(function (f) {
  check('literal README HTML renders', count(f) === 2)
  search(f, '#siteTableFilter', 'Dog'); check('README search works', values(f) === 'Boo,Sam')
  click(f, '.clear'); check('README clear works', count(f) === 2 && f.doc.querySelector('input').value === '')
  click(f, 'th:nth-child(2)'); check('README matching header keys sort', values(f) === 'Boo,Liza' && f.w.errors.length === 0)
  f.frame.remove()
  return load('custom', true)
}).then(function (f) {
  var opts = {data: [{Name: 'C++ [club]'}, {Name: '<img src=x onerror=alert(1)>'}, {Name: 'Schönefeld'}], tableDiv: '#table', filterDiv: '#filter', pagination: 2}
  f.w.Sheetsee.makeTable(opts); f.w.Sheetsee.initiateTableFilter(opts)
  check('HTML-looking cells are escaped', !f.doc.querySelector('img') && f.doc.querySelectorAll('td')[1].textContent === '<img src=x onerror=alert(1)>')
  search(f, '#filter', '['); check('literal bracket finds matching row', count(f) === 1 && f.doc.querySelector('td').textContent === 'C++ [club]' && !f.w.errors.length)
  search(f, '#filter', 'C++'); check('literal plus signs find matching row', count(f) === 1 && !f.w.errors.length)
  search(f, '#filter', 'schöne'); check('Unicode case-insensitive search', count(f) === 1 && f.doc.querySelector('td').textContent === 'Schönefeld')
  f.frame.remove()
  return load('empty', true)
}).then(function (f) {
  var opts = {data: [], tableDiv: '#table', filterDiv: '#filter', pagination: 2}
  f.w.Sheetsee.makeTable(opts); f.w.Sheetsee.initiateTableFilter(opts)
  check('empty spreadsheet renders no-results state', count(f) === 0 && /No results/.test(f.doc.getElementById('Pagination').textContent))
  search(f, '#filter', '['); click(f, '.clear'); check('empty data search and clear remain usable', count(f) === 0 && !f.w.errors.length)
  f.frame.remove()
  document.getElementById('summary').textContent = passed + ' PASS; ' + failed + ' FAIL'
  document.getElementById('summary').setAttribute('data-result', failed ? 'fail' : 'pass')
}).catch(function (error) {
  document.getElementById('summary').textContent = 'HARNESS ERROR: ' + error.stack
  document.getElementById('summary').setAttribute('data-result', 'fail')
})
