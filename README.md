[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

You'll need a placeholder `<div>` in your html, a `<script>` with a [Mustache.js](https://mustache.github.io) template and a `<script>` that tells Sheetsee to build the table.

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

- `data` _array_ of row objects, with spreadsheet column names as keys **required**
- `pagination` _number_ how many rows displayed at one time, defaults to all
- `tableDiv` _string_ the `<div>` `id` placeholder in your HTML, includes the hash `#` **required**
- `filterDiv` _string_ the `<input>` `id` used for search, includes the hash `#` **required if using filter**
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

_HTML (for `tableDiv: "#fullTable"`)_

```HTML
<div id='Pagination' pageno='{{currentPage}}' class='table-pagination'>
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

```html
<input id="tableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Step-by-step local example

This example uses local rows so you can check the table without a Google account or a spreadsheet network request. It uses this repository's existing Browserify setup.

### 1. Build the browser script

Install [Node.js](https://nodejs.org/) and npm first. Download or clone this repository, then run these commands from its directory:

```sh
npm install
npm run bfy
```

The second command creates `test/sheetsee.js`. It bundles this module and Mustache into one browser script. Open `test/index.html` in a browser to try the existing sample table. Run `npm run bfy` again if you edit `index.js`.

### 2. Prepare the spreadsheet rows

Use one header row and one row per item. For example:

| City | PlaceName | Year |
| --- | --- | --- |
| Portland | Rose Garden | 1917 |
| Seattle | Pike Place | 1907 |
| Portland | Forest Park | 1948 |
| Austin | Zilker Park | 1934 |

Sheetsee renders an array of JavaScript objects. It does not fetch or parse a spreadsheet itself. The `data` array in the next step is the same small sheet represented as objects. Replace those objects with your own rows, or pass in rows from your spreadsheet loader when they are available. Keep keys case-sensitive and use string values for sortable columns: the sorter calls `toLowerCase()` on each value. For example, use `'1917'`, not `1917`.

The older Tabletop.js examples require a separate spreadsheet loader. This local example does not depend on that service. For a larger sheet, convert its exported data to the same array of row objects before calling `makeTable()`.

### 3. Create the page

Save the following complete page as `test/manual.html`. Keep it next to the generated `test/sheetsee.js` so the relative script path works.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Spreadsheet table</title>
  <style>
    .tHeader, .clear, #Pagination a { cursor: pointer; }
    .no-pag { color: #777; }
  </style>
</head>
<body>
  <label for="siteTableFilter">Filter rows</label>
  <input id="siteTableFilter" type="text">
  <a href="#" class="clear">Clear</a>
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
        <tr><td>{{City}}</td><td>{{PlaceName}}</td><td>{{Year}}</td></tr>
        {{/rows}}
      </tbody>
    </table>
  </script>
  <script src="./sheetsee.js"></script>
  <script>
    var data = [
      { City: 'Portland', PlaceName: 'Rose Garden', Year: '1917' },
      { City: 'Seattle', PlaceName: 'Pike Place', Year: '1907' },
      { City: 'Portland', PlaceName: 'Forest Park', Year: '1948' },
      { City: 'Austin', PlaceName: 'Zilker Park', Year: '1934' }
    ]
    var tableOptions = {
      data: data,
      pagination: 2,
      tableDiv: '#siteTable',
      filterDiv: '#siteTableFilter',
      templateID: 'siteTable_template'
    }
    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  </script>
</body>
</html>
```

The scripts run after the input, placeholder and template exist. The template ID matches `templateID`. The clear link has `class="clear"`; the dot belongs in a CSS selector such as `.clear`, not in the HTML class name. The `Place Name` header sorts the `PlaceName` key because the sorter removes spaces from header text. The Mustache fields must also match the data keys exactly.

### 4. Check the table

Open `test/manual.html` in a browser. No web server or network request is required after the bundle is built.

1. Check that the first two rows appear and the footer says page 1 of 2.
2. Click **Next**, then **Previous**, to check both pages.
3. Type `Portland` in the filter. Check that only Rose Garden and Forest Park appear.
4. Click **Clear**. Check that the input is empty and all four rows are available again across two pages.
5. Click **City** once for ascending order, then again for descending order.
6. Type `no-such-city`. Check that no rows appear and the footer says **No results**. Click **Clear** to restore the rows.

If the page is empty, check the browser console. A missing `sheetsee.js` means you must run the build or correct its relative path. A missing-template error means the template ID and `templateID` do not match. If filtering does nothing, check `filterDiv`, the input ID and `class="clear"`. If sorting fails or cells are blank, check the capitalization of the headers, object keys and Mustache fields, and check that sortable values are strings.
