[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

This package renders an array of objects. Loading data from a spreadsheet is a separate step. The guide below shows the complete path from a public Google Sheet to a working table.

## Google Sheets quick start

### 1. Prepare the sheet

Use the first row for column names. This example expects `City`, `PlaceName`, and `Year`. In Google Sheets, share the sheet so that anyone with the link can view it, then copy the ID between `/d/` and `/edit` in its URL.

### 2. Install and build

Create an empty project folder, then install this package and Browserify:

```bash
npm install sheetsee-tables
npm install --save-dev browserify
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Places</title>
  </head>
  <body>
    <label for="siteTableFilter">Filter places</label>
    <input id="siteTableFilter" type="search">
    <button class="clear" type="button">Clear</button>
    <div id="siteTable"></div>

    <script id="siteTable_template" type="text/html">
      <table>
        <thead>
          <tr>
            <th class="tHeader">City</th>
            <th class="tHeader">Place Name</th>
            <th class="tHeader">Year</th>
          </tr>
        </thead>
        <tbody>
          {{#rows}}
            <tr>
              <td>{{City}}</td>
              <td>{{PlaceName}}</td>
              <td>{{Year}}</td>
            </tr>
          {{/rows}}
        </tbody>
      </table>
    </script>
    <script src="bundle.js"></script>
  </body>
</html>
```

The template ID is `siteTable_template` because the table placeholder is `siteTable`. The default naming rule is `<tableDiv>_template`.

### 3. Load the sheet and render the table

Create `app.js` and replace `YOUR_SHEET_ID` with the ID from step 1:

```javascript
var Sheetsee = require('sheetsee-tables')
var sheetID = 'YOUR_SHEET_ID'
var sheetName = 'Sheet1'

function loadSheet () {
  var url = 'https://docs.google.com/spreadsheets/d/' + sheetID +
    '/gviz/tq?tqx=out:json&sheet=' + encodeURIComponent(sheetName)

  return window.fetch(url)
    .then(function (response) {
      if (!response.ok) throw new Error('Could not load the sheet')
      return response.text()
    })
    .then(function (text) {
      var payload = JSON.parse(text.slice(text.indexOf('(') + 1, text.lastIndexOf(')')))
      var columns = payload.table.cols.map(function (column) { return column.label })

      return payload.table.rows.map(function (row) {
        var item = {}
        columns.forEach(function (column, index) {
          item[column] = row.c[index] ? row.c[index].v : ''
        })
        return item
      })
    })
}

document.addEventListener('DOMContentLoaded', function () {
  loadSheet()
    .then(function (data) {
      var tableOptions = {
        data: data,
        pagination: 10,
        tableDiv: '#siteTable',
        filterDiv: '#siteTableFilter'
      }

      Sheetsee.makeTable(tableOptions)
      Sheetsee.initiateTableFilter(tableOptions)
    })
    .catch(function (error) {
      document.getElementById('siteTable').textContent = error.message
    })
})
```

Build the browser bundle, then open `index.html`:

```bash
npx browserify app.js -o bundle.js
```

Click a column heading to sort, type in the filter field to search, or use the pagination links to move between pages.

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

- `data` _array_ your data from Tabletop.js **required**
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

```html
<input id="tableFilter" type="search" placeholder="filter by..">
<button type="button" class="clear">Clear</button>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Example

_HTML_

```html
<input id="siteTableFilter" type="search">
<button type="button" class="clear">Clear</button>
<div id="siteTable"></div>
```

_Template_

```html
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
      "filterDiv": "#siteTableFilter"
    }
    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

The `templateID` option is omitted here, so Sheetsee uses `siteTable_template` by default.
