[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# sheetsee-tables

Sheetsee,js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginate-able.

You'll need a placeholder `<div>` in your html, a `<script>` with a [Mustache.js](https://mustache.github.io) template and a `<script>` that tells Sheetsee to build the table.

## Step-by-step table manual

Use this walkthrough when you want to build a table from spreadsheet-style data and do not already have a working Sheetsee page.

### 1. Prepare your data

Sheetsee tables expect an array of objects. If you are using Tabletop.js or another spreadsheet loader, pass the rows it returns into `Sheetsee.makeTable()`. For a local test, you can start with plain JavaScript data:

```javascript
var data = [
  { City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870', Image: 'lake.jpg' },
  { City: 'Portland', PlaceName: 'Forest Park', Year: '1948', Image: 'forest.jpg' },
  { City: 'Chicago', PlaceName: 'The 606', Year: '2015', Image: '606.jpg' }
]
```

Keep the object keys consistent. Sorting uses the table header text to find the matching key, so a spreadsheet key named `PlaceName` can be displayed as `Place Name`, but changing the capitalization to `place name` or `PLACENAME` will prevent sorting from matching correctly.

### 2. Add the HTML placeholders

Add one input for filtering and one empty element for the table output:

```html
<input id="siteTableFilter" type="text" placeholder="filter by city, place, or year">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

The `filterDiv` option should point to the input id. The clear link must use `class="clear"`.

### 3. Add a Mustache template

The template describes one table row for each item in `data`. By default, Sheetsee looks for a template id that matches the table div id plus `_template`, so `#siteTable` pairs with `siteTable_template`.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
      <th>Image</th>
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

Use `class="tHeader"` only on columns that should be sortable.

### 4. Build and filter the table

Load Sheetsee, load or define your data, and then create the table after the DOM is ready:

```html
<script src="sheetsee.js"></script>
<script>
  var data = [
    { City: 'Oakland', PlaceName: 'Lake Merritt', Year: '1870', Image: 'lake.jpg' },
    { City: 'Portland', PlaceName: 'Forest Park', Year: '1948', Image: 'forest.jpg' },
    { City: 'Chicago', PlaceName: 'The 606', Year: '2015', Image: '606.jpg' }
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

### 5. Add basic pagination and sorting styles

Sheetsee adds pagination controls when `pagination` is set. You can style the generated elements and make sortable headers feel clickable:

```css
.tHeader {
  cursor: pointer;
}

.tHeader::after {
  content: " \2193 \2191";
  font-size: 10px;
  padding-left: 3px;
}

#Pagination {
  margin-top: 10px;
}

#Pagination a {
  cursor: pointer;
  margin-left: 8px;
}

.no-pag {
  color: #999;
  cursor: default;
}
```

### Troubleshooting checklist

- If no table appears, confirm `tableDiv` starts with `#` and matches an existing div.
- If the template is ignored, confirm `templateID` matches the template script id exactly and does not include `#`.
- If sorting does nothing, confirm the header has `class="tHeader"` and its text matches a data key when spaces are removed.
- If filtering does nothing, confirm `filterDiv` points to the input id and `Sheetsee.initiateTableFilter(tableOptions)` is called after `Sheetsee.makeTable(tableOptions)`.
- If the clear link does not work, use `class="clear"` instead of `class=".clear"`.
- If pagination is missing, set `pagination` to a number lower than the number of rows.

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
<a href="#" class="clear">Clear</a>
```

Then you'll pass your `tableOptions` object into this method:

```javascript
Sheetsee.initiateTableFilter(tableOptions)
```

## Example

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
