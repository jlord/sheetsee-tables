# Sheetsee tables: a working step-by-step manual

This guide builds the checked-in demo locally. It avoids the retired hosted
examples and makes the generated browser bundle explicit, so the same steps
work from a fresh clone.

## 1. Prerequisites

- Node.js 12 or newer and npm.
- A browser with JavaScript enabled.

Clone the repository and enter it:

```bash
git clone https://github.com/jlord/sheetsee-tables.git
cd sheetsee-tables
```

## 2. Install and build

Install the package and development dependencies, then bundle the browser
entrypoint:

```bash
npm install
npm run bfy
```

`npm run bfy` runs Browserify on `test/set.js` and writes the generated
`test/sheetsee.js` file. The generated file is intentionally not committed;
rebuild it whenever `index.js` changes.

## 3. Run the local example

Serve the `test` directory over HTTP. Opening `index.html` directly with a
`file://` URL can prevent scripts from loading in some browsers.

```bash
cd test
python -m http.server 8000
```

Open <http://localhost:8000/index.html>. The example should show five rows
with two rows per page. Use the filter input to search (try `cat`), click a
column heading to sort, and use **Previous**/**Next** to change pages. The
**Clear** link restores all rows.

Stop the server with `Ctrl-C` when finished.

## 4. Create your own table

Start with a placeholder, a Mustache template, and a JavaScript data array:

```html
<input id="peopleFilter" type="text" placeholder="filter by…">
<a href="#" class="clear">Clear</a>
<div id="peopleTable"></div>

<script id="peopleTable_template" type="text/html">
  <table>
    <tr><th class="tHeader">Name</th><th class="tHeader">City</th></tr>
    {{#rows}}<tr><td>{{Name}}</td><td>{{City}}</td></tr>{{/rows}}
  </table>
</script>

<script>
  var data = [
    { Name: 'Ada', City: 'London' },
    { Name: 'Grace', City: 'New York' }
  ]

  var tableOptions = {
    data: data,
    pagination: 10,
    tableDiv: '#peopleTable',
    filterDiv: '#peopleFilter',
    templateID: 'peopleTable_template'
  }

  Sheetsee.makeTable(tableOptions)
  Sheetsee.initiateTableFilter(tableOptions)
</script>
```

The text inside each `.tHeader` must match the spreadsheet key after spaces
are removed. For example, the key `PlaceName` is displayed as `Place Name`,
not `PLACENAME` or `placename`.

## 5. Use spreadsheet data

Replace the example `data` array with the array returned by your spreadsheet
loader (for example, Tabletop.js). Call `Sheetsee.makeTable` only after that
array has loaded. Keep the same option names and make sure every template
field exists in each row.

## Troubleshooting

- **Blank page:** run `npm run bfy` and confirm `test/sheetsee.js` exists.
- **No filtering:** keep both `filterDiv` and an element with that id, plus a
  `.clear` link.
- **Sorting does nothing:** add `class="tHeader"` to each sortable header and
  match its displayed text to the data key.
- **Pagination looks wrong:** use a positive `pagination` number; omit it if
  all rows should be displayed at once.
- **Scripts blocked:** serve the directory over HTTP instead of using a
  `file://` URL.
