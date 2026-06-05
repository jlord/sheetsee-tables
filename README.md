[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee,js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

You'll need a placeholder `<div>` in your html, a `<script>` with a [Mustache.js](https://mustache.github.io) template and a `<script>` that tells Sheetsee to build the table.

## Quick start

This example starts with an array of spreadsheet rows and turns it into a
sortable, searchable table.

### 1. Add your data

Sheetsee tables expect an array of objects. If you are loading a Google
Spreadsheet through Tabletop.js, pass the rows that Tabletop returns. For a
small local test, a plain array works too:

```javascript
var data = [
  {City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870'},
  {City: 'San Francisco', PlaceName: 'Sutro Baths', Year: '1896'},
  {City: 'Los Angeles', PlaceName: 'Griffith Park', Year: '1896'}
]
```

### 2. Add a filter input and table placeholder

The filter input is optional. If you include it, the `filterDiv` option in
your script must point to the input id. The clear link must use the `clear`
class.

```html
<input id="siteTableFilter" type="text" placeholder="filter by city or place">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

### 3. Add the table template

The template id must match the `templateID` option used in your script. Header
text controls sorting, so keep the same capitalization as the spreadsheet
column names, ignoring spaces.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{City}}</td>
        <td>{{PlaceName}}</td>
        <td>{{Year}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

### 4. Build the table

Call `Sheetsee.makeTable()` after the page and data are ready. Then call
`Sheetsee.initiateTableFilter()` if you included the filter input.

```html
<script>
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

If the table does not render, first check that `tableDiv` points to an
existing placeholder and `templateID` exactly matches your template script id.
If filtering does not work, check that `filterDiv` points to the input id and
that the clear link has `class="clear"`.

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
<input id="tableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Example

_HTML_

```HTML
<input id="siteTableFilter" type="text"><a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

_Template_

```JavaScript
<script id="siteTable_template" type="text/html">
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
