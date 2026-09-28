[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

You'll need a placeholder `<div>` in your html, a `<script>` with a [Mustache.js](https://mustache.github.io) template and a `<script>` that tells Sheetsee to build the table.

## Start here: a working spreadsheet example

The [CSV example](example/index.html) runs locally with its own sample data. It does not need a Google account, API key, Tabletop.js or an external JavaScript CDN.

### 1. Install and build

For this walkthrough, install Node.js 18 or later, npm, Git and Python 3 (used only to serve the example).

```sh
git clone https://github.com/jlord/sheetsee-tables.git
cd sheetsee-tables
npm install
npm run build:example
python3 -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/example/** in a browser. Keep the server running. Do not open the HTML as a `file://` URL: fetching CSV needs an HTTP server.

You should see “Loaded 5 rows from CSV”, Liza and Boo on the first page, and three pages of results. Try **Next**, filter for **Dog** (Boo and Sam), **Clear**, and click **Name** to change the sort order. The generated `example/bundle.js` contains Sheetsee, Mustache and the example's CSV parser. Rebuild after editing JavaScript; generated bundles are not committed.

### 2. Use a spreadsheet

Create a sheet with a header row and three columns. These names are case-sensitive; their order can change.

| Animal | Name | Rating |
| --- | --- | --- |
| Cat | Liza | 10 |
| Dog | Boo | 9 |
| Dog | Sam | 10 |
| Cat | Snowy | 4 |
| Cat | Trisana | 7 |

Export the sheet as **UTF-8 comma-separated values (`.csv`)**. In Google Sheets, use **File → Download → Comma-separated values (.csv, current sheet)**; Excel and LibreOffice also offer CSV export. Save it over `example/data.csv`, then reload the browser. CSV changes do not require rebuilding JavaScript. This workflow does not publish your spreadsheet or depend on an external demo service.

The [example parser](example/csv.js) handles quoted commas, quotes and newlines. It checks the three column names and keeps cells as strings because the table's sorter expects strings. A sheet with just the header row displays “No results”. Missing columns, malformed CSV and failed requests display an error instead of leaving a blank page.

For different columns, change the `columns` list in `example/csv.js`, the headings and `{{field}}` names in `example/index.html`, and your CSV headers together. Keep the capitalization consistent. Rebuild after changing the parser.

### 3. Optional: load a hosted CSV

The **CSV address** field accepts a relative CSV path or an HTTP(S) URL; **Load CSV** reloads the page with that source. A remote server must allow browser cross-origin requests (CORS). A normal spreadsheet editor/sharing URL returns HTML, not CSV, and will not work.

For a sheet intended for public viewing, Google Sheets' [Publish to web](https://support.google.com/docs/answer/183965) flow can publish an individual sheet as CSV. Use the resulting CSV URL, not the editing URL. Published data is public; choose this only for data you mean to share. If the host blocks CORS or requires sign-in, use the downloaded local CSV workflow above. No credentials are sent with the example's CSV request.

### How it fits together

- `example/data.csv` contains the exported spreadsheet.
- `example/csv.js` turns CSV into objects such as `{Animal: 'Cat', Name: 'Liza', Rating: '10'}`.
- `example/index.html` supplies the input, `.clear` button, empty table container and Mustache template.
- `example/table.js` fetches the CSV, calls `makeTable` once after it loads, and connects filtering. Loading errors appear on the page.

This module creates a table from an array; it does not fetch spreadsheets itself. The walkthrough supplies that step without depending on the old hosted demo. The API below also works with arrays obtained another way.

## Troubleshooting

- **Loading message never changes:** run `npm run build:example`, verify `example/bundle.js` exists, then reload.
- **HTTP 404:** check the CSV address relative to `example/` and serve from the repository root.
- **CSV header error:** use `Animal,Name,Rating` with matching capitalization; an HTML login/editing page is not CSV.
- **Remote request fails:** the file must be public and permit CORS. Download it as `example/data.csv` to test locally.
- **Your own template is blank:** its script `id` must equal `templateID`; every `{{field}}` must match a data key exactly.
- **Filter does nothing:** use `class="clear"` (without a dot), and point `filterDiv` at the input itself.

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

- `data` _array_ objects with string cell values, from CSV or another data source **required**
- `pagination` _number_ how many rows displayed at one time, defaults to all
- `tableDiv` _string_ the `<div>` `id` placeholder in your HTML, includes the hash `#` **required**
- `filterDiv` _string_ the `<input>` `id` used for filtering if using search, includes the hash `#` **required if using filter**
- `templateID` _string_ the `id` of your `<script>` tag with the template, defaults to `tableDiv` without the hash + `_template`.

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

If you do not put in a number for pagination, by default it will show all of the data at once. With pagination, HTML will be added at the bottom of your table for navigation, which you can style in your CSS. Navigation classes include the table container id (here `fullTable`):

_HTML_

```HTML
<div id='Pagination' pageno='1' class='table-pagination'>
  Showing page {{currentPage}} of {{totalPages}}
  <a class='pagination-pre-fullTable'>Previous</a><a class='pagination-next-fullTable'>Next</a>
</div>
```

_CSS_

```CSS
#Pagination {}
.pagination-next-fullTable {}
.pagination-pre-fullTable {}
.no-pag {}
```

### `Sheetsee.initiateTableFilter(tableOptions)`

If you want to have an input to allow users to search/filter the data in the table, you'll add an input to your HTML. Give it an id and if you want add placeholder text. You'll also need to add a 'clear' button using the `.clear` CSS class.

```javascript
<input id="tableFilter" type="text" placeholder="filter by.."></input>
<a href="#" class="clear">Clear</a>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Example

This snippet assumes Sheetsee is loaded and `data` is an array with `City`, `PlaceName`, `Year` and `Image` string properties. For a complete page with dependency setup and CSV loading, follow the walkthrough above.

_HTML_

```HTML
<input id="siteTableFilter" type="text"></input><a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

_Template_

```JavaScript
<script id="siteTable_template" type="text/html">
    <table>
    <tr><th class="tHeader">City</th><th class="tHeader">Place Name</th><th class="tHeader">Year</th><th class="tHeader">Image</th></tr>
      {{#rows}}
        <tr><td>{{City}}</td><td>{{PlaceName}}</td><td>{{Year}}</td><td>{{Image}}</td></tr>
      {{/rows}}
  </table>
</script>
```

_JavaScript_

```javascript
<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function() {
    var tableOptions = {
      "data": data,
      "pagination": 10,
      "tableDiv": "#siteTable",
      "filterDiv": "#siteTableFilter",
      "templateID": "siteTable_template"
    }
    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

## Check the examples

```sh
npm run test:csv       # Spreadsheet parsing and validation checks
npm run build:example # Build the walkthrough
npm run bfy           # Build the original table test page
```

With the same HTTP server running, open `/example/` for the CSV walkthrough or `/test/` for the original in-memory table fixture. Use the [browser QA checklist](test/qa.md) to check interactions. `npm test` also tries the macOS `open` command; on Linux or Windows use `npm run bfy` and navigate to `/test/`.
