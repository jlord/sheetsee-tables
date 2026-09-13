[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable, and paginate-able.

You'll need a placeholder `<div>` in your HTML, a `<script>` with a [Mustache.js](https://mustache.github.io) template, and a `<script>` that tells Sheetsee to build the table.

## Quick Start (local demo that actually works)

This repo ships a self-contained demo under `test/` that does **not** depend on the old live site demos.

```bash
npm install
npm run bfy          # builds test/sheetsee.js from index.js
python3 -m http.server 8765 --directory test
# open http://localhost:8765/
```

You should see a 5-row animal table (2 per page), working sort headers, filter, Clear, and pagination.

For a full walkthrough from spreadsheet → Tabletop → table, see [`docs/STEP_BY_STEP.md`](docs/STEP_BY_STEP.md).
If something renders blank, see [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md).

## Your HTML Placeholder

This is as simple as an empty `<div>` with an `id`.

## Your Template

Your template is the mockup of what you'd like your table to look like and what content it should show. The style is up to you! It is a [mustache](https://mustache.github.io) template inside of `<script>` tags.

**The `id` of the template must match `tableDiv` + `_template` (without the `#`), unless you set `templateID` explicitly.**

Example: if `tableDiv` is `#fullTable`, the template id should be `fullTable_template`.

### Sorting

If you want users to be able to click on headers and sort that column, your template must include table headers with the class `tHeader`.

You can then style `.tHeader` in your CSS to make them look how you want.

**Header text must match the spreadsheet column key after spaces and non-word characters are stripped.** Spreadsheet keys are used as object properties (often TitleCase from Google Sheets).

- Spreadsheet column name: `PlaceName`
  - OK table header text: `PlaceName` or `Place Name` (spaces are stripped before lookup)
  - Not OK: `placename` (different casing than the data key)

## Your Script

Set your table options and pass them into `Sheetsee.makeTable()`. If you want search/filter, also call `Sheetsee.initiateTableFilter()` with the same options.

## Methods

### `Sheetsee.makeTable(tableOptions)`

Pass an object containing:

- `data` _array_ your data from Tabletop.js **required**
- `pagination` _number_ how many rows displayed at one time, defaults to all
- `tableDiv` _string_ the `<div>` `id` placeholder in your HTML, includes the hash `#` **required**
- `filterDiv` _string_ the `<div>`/`<input>` `id` used for search, includes the hash `#` **required if using filter**
- `templateID` _string_ the `id` of your `<script>` tag with the template; defaults to `tableDiv` without `#` + `_template`

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

_HTML_ (generated)

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

Add a text input and a clear control. The clear control must use `class="clear"` (not `class=".clear"`).

```html
<input id="fullTableFilter" type="text" placeholder="filter by.."></input>
<a href="#" class="clear">Clear</a>
```

Then pass your `tableOptions` object:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

If `.clear` is missing, or `filterDiv` does not match a real input id, filtering silently does nothing.

## Corrected Example

This matches what `index.js` actually expects (and what `test/index.html` uses).

_HTML_

```html
<input id="siteTableFilter" type="text" placeholder="filter by.."></input>
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

_Template_ — id is `siteTable_template`, and Mustache keys match the data keys exactly:

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">PlaceName</th>
      <th class="tHeader">Year</th>
      <th class="tHeader">Image</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{City}}</td>
        <td>{{PlaceName}}</td>
        <td>{{Year}}</td>
        <td>{{Image}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

_JavaScript_

```html
<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function () {
    var tableOptions = {
      data: data,
      pagination: 10,
      tableDiv: '#siteTable',
      filterDiv: '#siteTableFilter'
      // templateID defaults to 'siteTable_template'
    }
    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

## Why the old site demos break

Common failure modes (also documented in `docs/TROUBLESHOOTING.md`):

1. README previously showed `class=".clear"` — that never matches `document.querySelector('.clear')`.
2. README previously used template id `tableTemplate` while `templateID` was `siteTable_template`.
3. Mustache fields like `{{placename}}` do not fill if your data keys are `PlaceName`.
4. The historical live demo at `http://jlord.us/sheetsee.js/demos/demo-table.html` is often unreachable; use the local `test/` demo instead.

## Docs

- [`docs/STEP_BY_STEP.md`](docs/STEP_BY_STEP.md) — spreadsheet → published table
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — blank table / filter / sort fixes
- [`test/qa.md`](test/qa.md) — manual QA checklist for the local demo
