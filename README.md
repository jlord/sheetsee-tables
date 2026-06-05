# sheetsee-tables

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

`sheetsee-tables` is the table module used by Sheetsee.js. It renders spreadsheet-style data as sortable, searchable, and paginated HTML tables.

The module expects data that has already been loaded into JavaScript, for example from Tabletop.js or from another spreadsheet/export loader. Once the data is available as an array of objects, `sheetsee-tables` can render it into a table.

## Install

```bash
npm install sheetsee-tables
```

If you use Sheetsee.js directly in the browser, include Sheetsee before the script that builds your table.

## Basic setup

To build a table you need three pieces:

1. An empty HTML placeholder where the table will be rendered.
2. A Mustache template that describes the table markup.
3. A script that passes your spreadsheet data into `Sheetsee.makeTable()`.

If you also want search/filtering, add an input field and pass the same options into `Sheetsee.initiateTableFilter()`.

## Complete example

This example assumes your spreadsheet data is already available as a JavaScript array named `data`.

```html
<input id="siteTableFilter" type="text" placeholder="Filter by city, place, or year">
<a href="#" class="clear">Clear</a>

<div id="siteTable"></div>

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

## Table options

`Sheetsee.makeTable(tableOptions)` accepts an object with these fields:

| Option | Required | Description |
| --- | --- | --- |
| `data` | Yes | Array of row objects from your spreadsheet data. |
| `tableDiv` | Yes | CSS id selector for the placeholder element, including `#`. |
| `templateID` | No | Id of the Mustache template script. Defaults to the `tableDiv` id plus `_template`. |
| `pagination` | No | Number of rows shown per page. If omitted, all rows are shown. |
| `filterDiv` | Only for filtering | CSS id selector for the search input, including `#`. |

## Sorting

To make a column sortable, add the `tHeader` class to that column's `<th>` element.

The visible header text must match the spreadsheet property name after spaces and punctuation are removed. Capitalization matters in the current implementation.

For example:

| Spreadsheet property | Valid table header | Invalid table header |
| --- | --- | --- |
| `PlaceName` | `Place Name` | `PLACENAME`, `placename` |
| `City` | `City` | `city` |

## Filtering

Filtering needs:

1. An input element whose id matches `filterDiv`.
2. A clear link or button with the class `clear`.
3. A call to `Sheetsee.initiateTableFilter(tableOptions)`.

```html
<input id="siteTableFilter" type="text" placeholder="Filter rows">
<a href="#" class="clear">Clear</a>
```

```js
Sheetsee.initiateTableFilter(tableOptions)
```

Do not write `class=".clear"` in HTML. The dot is only used in CSS selectors; the HTML class should be `class="clear"`.

## Pagination

Set `pagination` to the number of rows you want to display per page:

```js
var tableOptions = {
  data: data,
  pagination: 10,
  tableDiv: '#siteTable',
  templateID: 'siteTable_template'
}
```

When pagination is enabled, the module appends pagination controls to the table container. If the data has fewer rows than the pagination size, it shows a single page.

## Common mistakes

### The table does not render

Check that `tableDiv` points to an existing element:

```html
<div id="siteTable"></div>
```

```js
tableDiv: '#siteTable'
```

### The template is not found

Make sure `templateID` matches the template script id exactly:

```html
<script id="siteTable_template" type="text/html">
```

```js
templateID: 'siteTable_template'
```

### Filtering does not work

Make sure the clear control uses `class="clear"` and the input id matches `filterDiv`:

```html
<input id="siteTableFilter" type="text">
<a href="#" class="clear">Clear</a>
```

```js
filterDiv: '#siteTableFilter'
```

### Sorting does not work

Make sure sortable headers use `class="tHeader"` and the header text matches the data property after spaces and punctuation are removed.

## API

### `Sheetsee.makeTable(tableOptions)`

Renders the table into the placeholder element.

### `Sheetsee.initiateTableFilter(tableOptions)`

Adds filtering behavior to the input specified by `filterDiv`.
