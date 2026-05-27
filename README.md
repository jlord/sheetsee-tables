[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

You'll need a placeholder `<div>` in your html, a `<script>` with a [Mustache.js](https://mustache.github.io) template and a `<script>` that tells Sheetsee to build the table.

## Your HTML Placeholder

This is as simple as an empty `<div>` with an `id`.

```html
<div id="siteTable"></div>
```

## Your Template

Your template is the mockup of what you'd like your table to look like and what content it should show. The style is up to you! It is a [mustache](https://mustache.github.io) template inside of `<script>` tags.

**The `id` of the template should be the same as the HTML placeholder it corresponds to but with "_template" on the end.**

For example, if your table placeholder is `siteTable`, the default template id is `siteTable_template`.

### Sorting

If you want users to be able to click on headers and sort that column, your template must include table headers with the class `tHeader`.

You can then style `.tHeader` in your CSS to make them look how you want.

**You must also make the inner text of your table headers have the same capitalization as in your spreadsheet. It's ok to have spaces in your table header but don't use spaces in your spreadsheet headers.**

- Spreadsheet column name: 'PlaceName'
  - OK table header: 'Place Name'
  - Not OK table header:  'PLACENAME', 'placename'

## Your Script

You'll want to set your table options and pass them into `Sheetsee.makeTable()`. If you want to add a search/filter, pass your options into `Sheetsee.initiateTableFilter()`.

The `data` option should be an array of objects. Each object key should match the Mustache fields used in your template.

```javascript
var data = [
  { City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870' },
  { City: 'Portland', PlaceName: 'Forest Park', Year: '1948' }
]
```

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
<input id="tableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Example

This is a complete table example. It creates a searchable, sortable table with two rows per page.

_HTML_

```HTML
<input id="siteTableFilter" type="text" placeholder="filter by..">
<a href="#" class="clear">Clear</a>
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
    var data = [
      { City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870', Image: 'lake.jpg' },
      { City: 'Portland', PlaceName: 'Forest Park', Year: '1948', Image: 'forest.jpg' },
      { City: 'Seattle', PlaceName: 'Gas Works Park', Year: '1975', Image: 'gasworks.jpg' }
    ]

    var tableOptions = {
      "data": data,
      "pagination": 2,
      "tableDiv": "#siteTable",
      "filterDiv": "#siteTableFilter"
    }

    Sheetsee.makeTable(tableOptions)
    Sheetsee.initiateTableFilter(tableOptions)
  })
</script>
```

## Running the bundled demo locally

The old hosted demo links may be unavailable. This repository includes a working local demo under `test/index.html`.

```bash
npm install
npm run bfy
```

Then open `test/index.html` in a browser. The demo should let you:

- type `cat` in the filter and see only matching rows
- click table headers with the `tHeader` class to sort
- use Previous/Next pagination links
- click Clear to reset the filter
