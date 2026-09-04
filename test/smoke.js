// Headless smoke test: verify sheetsee-tables actually renders a table.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const bundle = fs.readFileSync('dist/sheetsee-tables.js', 'utf8');

const dom = new JSDOM(`
  <div id="siteTable"></div>
  <script id="siteTable_template" type="text/html">
    <table>
      <thead><tr><th class="tHeader">City</th><th class="tHeader">Place Name</th><th class="tHeader">Year</th></tr></thead>
      <tbody>{{#rows}}<tr><td>{{city}}</td><td>{{placename}}</td><td>{{year}}</td></tr>{{/rows}}</tbody>
    </table>
  </script>
`, { runScripts: 'outside-only' });

const { window } = dom;
window.eval(bundle);
const Sheetsee = window.Sheetsee;

const data = [
  { city: 'Paris', placename: 'Eiffel Tower', year: '1889' },
  { city: 'London', placename: 'Big Ben', year: '1859' },
  { city: 'New York', placename: 'Statue of Liberty', year: '1886' }
];

Sheetsee.makeTable({ data: data, pagination: 2, tableDiv: '#siteTable', templateID: 'siteTable_template' });
const out = window.document.getElementById('siteTable').innerHTML;

console.log('rendered rows (page 1):', out.includes('Eiffel Tower') && out.includes('Big Ben') ? 'PASS' : 'FAIL');
console.log('paginated (2 rows + "Showing page 1 of 2"):', out.includes('Showing page 1 of 2') ? 'PASS' : 'FAIL');
console.log('page-2 row excluded from page 1:', !out.includes('Statue of Liberty') ? 'PASS' : 'FAIL');
console.log('table markup present:', out.includes('<table>') ? 'PASS' : 'FAIL');
console.log('\n--- rendered HTML ---\n' + out.slice(0, 500));
