[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

You'll need a placeholder `<div>` in your HTML, a [Mustache.js](https://mustache.github.io) template and a script that tells Sheetsee to build the table. The local example below works without the old hosted demos or a live spreadsheet API.

## Step by step: run a table

You need Git and Node.js with npm (tested with Node 24). From a terminal:

```sh
git clone https://github.com/jlord/sheetsee-tables.git
cd sheetsee-tables
npm ci --ignore-scripts
npm run bfy
npm start
```

Open **http://127.0.0.1:8080**. You should see two rows on page 1 of 3. Search for `Dog` to see Boo and Sam, then press **Clear**. Click a column heading to sort. Stop the local server with Ctrl+C. If port 8080 is busy, set the `PORT` environment variable to another local port before starting it.

The bundle is generated locally from this module and Mustache. No CDN, Google login, public-sheet permission or API key is needed. `npm start` serves only the demo files on your own computer; it does not publish a website.

### Use your spreadsheet

1. Make a sheet with the first-row column names **Animal**, **Name** and **Rating**, with that exact capitalization. Add a few rows, or open [test/sample.csv](test/sample.csv) in your spreadsheet program. Keep one header row, no merged cells, and no blank column names.
2. Export/download the worksheet as **CSV, comma-separated, UTF-8**. This is a local snapshot, not a live connection. Save it somewhere on your computer; do not commit private data.
3. Convert it, rebuild, then refresh the page:

   ```sh
   node tools/csv-to-data.js "path/to/your-sheet.csv" test/data.json
   npm run bfy
   ```

The converter supports quoted commas, doubled quotes, quoted newlines and a UTF-8 BOM. It ignores blank lines, rejects malformed rows or duplicate/empty column names, and writes valid JSON only after parsing succeeds. All cell values stay **strings**, including numbers and leading zeroes. The existing sorter expects strings; it does not provide general numeric/date typing. The reserved object keys `__proto__`, `constructor` and `prototype` are rejected as column names.

`test/data.json` is the data bundled into the demo; the page shows that same array below the table. The bundled sample CSV converts to the supplied five rows. To restore it:

```sh
node tools/csv-to-data.js test/sample.csv test/data.json
npm run bfy
```

For other column names, update the demo's `<th>` labels, `{{Field}}` placeholders and required-column check in `test/index.html` together. Keys are case-sensitive. Use simple letters/numbers in headers; sorting derives a key from the visible heading with spaces and punctuation removed. For example `Place Name` sorts the `PlaceName` key. This module accepts an array of objects from any source; Tabletop is not required for the CSV workflow.

### Troubleshooting and checks

- Blank page or `Sheetsee is not defined`: run `npm run bfy` successfully before opening the local URL. Build errors return a nonzero exit code. Refresh after every data or source change.
- Missing template: `templateID` must name an existing script element. It has no `#`; `tableDiv` and `filterDiv` include `#`.
- Search does nothing: use `class="clear"`, not `class=".clear"`, and pass the same options to both methods. Search is a case-insensitive literal substring search across the row's serialized values/keys; it is not a regular expression.
- Sort throws: make the column heading match the data key and keep values as strings. The example reports missing required fields before rendering.
- Incorrect CSV: export comma-separated UTF-8, not an `.xlsx` file or a semicolon-delimited file. A conversion error leaves the existing JSON file untouched.

Run `npm test`, `npm run lint` and `npm run bfy`. With the server running, open **http://127.0.0.1:8080/regressions.html** for actual browser checks; `npm test` alone does not launch or test a browser. See [the QA checklist](test/qa.md).

## Your HTML Placeholder

This is as simple as an empty `<div>` with an `id`.

## Your Template

Your template is the mockup of what you'd like your table to look like and what content it should show. The style is up to you! It is a [mustache](https://mustache.github.io) template inside of `<script>` tags.

**The `id` of the template should be the same as the HTML placeholder it corresponds to but with "_template" on the end.**

### Sorting

If you want users to be able to click on headers and sort that column, your template must include table headers with the class `tHeader`.

You can then style `.tHeader` in your CSS to make them look how you want.

**You must also make the inner text of your table headers have the same capitalization as in your spreadsheet. It's ok to have spaces in your table header but don't use spaces in your spreadsheet headers.**

- Spreadsheet column name: 'PlaceName'
  - OK table header: 'Place Name'
  - Not OK table header:  'PLACENAME', 'placename'

## Your Script

You'll want to set your table options and pass them into `Sheetsee.makeTable()`. If you want to add a search/filter, pass your options into `Sheetsee.initiateTableFilter()`.

## Methods

Functions for you to use! There are just two, woo!

### `Sheetsee.makeTable(tableOptions)`

You pass in an object containing:

- `data` _array_ objects with string-valued fields, for example the CSV output above **required**
- `pagination` _number_ how many rows displayed at one time, defaults to all
- `tableDiv` _string_ the `<div>` `id` placeholder in your HTML, includes the hash `#` **required**
- `filterDiv` _string_ the `<div>` `id` containing your `<input>` filter if using search, includes the hash `#` **required if using filter**
- `templateID` _string_ the `id` of your `<script>` tag with the template, defaults to assume it's the same as `tableDiv` + `_template`.

```javascript
var tableOptions = {
  "data": data,
  "pagination": 10,
  "tableDiv": "#fullTable",
  "filterDiv": "#fullTableFilter",
  "templateID": "fullTable_template"
}
Sheetsee.makeTable(tableOptions)
```

#### Pagination

If you do not put in a number for pagination, by default it will show all of the data at once. With pagination, HTML will be added at the bottom of your table for navigation, which you can style in your CSS:

_HTML_

```HTML
<div id='Pagination' currentPage class='table-pagination'>
  Showing page {{currentPage}} of {{totalPages}}
  <a class='pagination-pre'>Previous</a><a class='pagination-next'>Next</a>
</div>
```

_CSS_

```CSS
#Pagination {}
.pagination-next {}
.pagination-pre {}
.no-pag {}
```

### `Sheetsee.initiateTableFilter(tableOptions)`

If you want to have an input to allow users to search/filter the data in the table, you'll add an input to your HTML. Give it an id and if you want add placeholder text. You'll also need to add a 'clear' button using the `.clear` CSS class.

```javascript
<input id="tableFilter" type="text" placeholder="filter by.."></input>
<button type="button" class="clear">Clear</button>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Copyable example

Save this as `test/readme-example.html` after building the bundle. The build also generates this page from the block below so the browser checks exercise the documented example. The supplied bundle exposes both `Sheetsee` and the sample/imported `data` array; other applications can pass their own array.

```html
<!doctype html>
<meta charset="utf-8">
<title>My spreadsheet table</title>
<script src="./sheetsee.js"></script>
<label for="siteTableFilter">Search</label>
<input id="siteTableFilter" type="text"><button type="button" class="clear">Clear</button>
<div id="siteTable"></div>
<script id="siteTable_template" type="text/html">
    <table>
    <tr><th class="tHeader">Animal</th><th class="tHeader">Name</th><th class="tHeader">Rating</th></tr>
      {{#rows}}
        <tr><td>{{Animal}}</td><td>{{Name}}</td><td>{{Rating}}</td></tr>
      {{/rows}}
  </table>
</script>
<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function() {
    var tableOptions = {
      "data": data,
      "pagination": 2,
      "tableDiv": "#siteTable",
      "filterDiv": "#siteTableFilter",
      "templateID": "siteTable_template"
    }
    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

Run the local demo above to try the table and review the spreadsheet setup steps.
