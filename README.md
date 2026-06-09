[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee,js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

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

```javascript
<input id="tableFilter" type="text" placeholder="filter by.."></input>
<a href="#" class=".clear">Clear</a>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Example

_HTML_

```HTML
<input id="siteTableFilter" type="text"></input><a href="#" class=".clear">Clear</a>
<div id="siteTable"></div>
```

_Template_

```JavaScript
<script id="tableTemplate" type="text/html">
    <table>
    <tr><th class="tHeader">City</th><th class="tHeader">Place Name</th><th class="tHeader">Year</th><th class="tHeader">Image</th></tr>
      {{#rows}}
        <tr><td>{{city}}</td><td>{{placename}}</td><td>{{year}}</td><td>{{image}}</td></tr>
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

_[View Demo](http://jlord.us/sheetsee.js/demos/demo-table.html)_
_[Visit Site](http://jlord.us/sheetsee.js)_

## Step-by-step manual

Use this checklist when you want to turn spreadsheet rows into a searchable,
sortable table.

### 1. Prepare the spreadsheet

Create one header row and keep the header names simple. Sheetsee normalizes
headers into lowercase keys, so a spreadsheet header named `PlaceName` is read
in templates as `{{placename}}`.

Example sheet:

| City | PlaceName | Year | Image |
| --- | --- | --- | --- |
| Portland | Powell's City of Books | 1971 | books.jpg |
| Detroit | Belle Isle Aquarium | 1904 | aquarium.jpg |

If you use a Google Sheet with Tabletop.js, publish the sheet or make sure the
sheet is readable by the page that loads it.

### 2. Add the page elements

Add a filter input, a clear link and an empty table container. The container id
is the value you will pass as `tableDiv`.

```html
<input id="siteTableFilter" type="text" placeholder="Filter by city, place or year">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

### 3. Add a Mustache table template

Create a `<script>` template for the rows. Header cells with the class
`tHeader` become sortable. Header text should match the spreadsheet column name
closely enough for Sheetsee to map it back to the data key.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <thead>
      <tr>
        <th class="tHeader">City</th>
        <th class="tHeader">Place Name</th>
        <th class="tHeader">Year</th>
        <th>Image</th>
      </tr>
    </thead>
    <tbody>
      {{#rows}}
        <tr>
          <td>{{city}}</td>
          <td>{{placename}}</td>
          <td>{{year}}</td>
          <td>{{image}}</td>
        </tr>
      {{/rows}}
    </tbody>
  </table>
</script>
```

### 4. Load data and build the table

If you already have an array of row objects, pass it directly to
`Sheetsee.makeTable()`.

```html
<script>
  var data = [
    { city: 'Portland', placename: "Powell's City of Books", year: '1971', image: 'books.jpg' },
    { city: 'Detroit', placename: 'Belle Isle Aquarium', year: '1904', image: 'aquarium.jpg' }
  ]

  document.addEventListener('DOMContentLoaded', function () {
    var tableOptions = {
      data: data,
      pagination: 10,
      tableDiv: '#siteTable',
      filterDiv: '#siteTableFilter',
      templateID: 'siteTable_template'
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

When using Tabletop.js, call `Sheetsee.makeTable()` only after Tabletop has
returned spreadsheet rows:

```html
<script>
  function showInfo(data) {
    var tableOptions = {
      data: data,
      pagination: 10,
      tableDiv: '#siteTable',
      filterDiv: '#siteTableFilter',
      templateID: 'siteTable_template'
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  }

  document.addEventListener('DOMContentLoaded', function () {
    Tabletop.init({
      key: 'YOUR_PUBLIC_SPREADSHEET_KEY',
      callback: showInfo,
      simpleSheet: true
    })
  })
</script>
```

### 5. Check the result

- If the table is empty, log `data` before calling `Sheetsee.makeTable()` and
  confirm it is an array of objects.
- If sorting does not work, confirm each sortable header has `class="tHeader"`.
- If a column is blank, compare the spreadsheet header with the Mustache key.
  `PlaceName` should be rendered as `{{placename}}`.
- If filtering does not work, make sure `filterDiv` includes the hash and points
  to the input id, for example `#siteTableFilter`.
- If pagination is not visible, confirm `pagination` is a number smaller than
  the total row count.
