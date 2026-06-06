# Sheetsee Tables Manual

This guide walks through the smallest complete setup for a sortable,
searchable, paginated Sheetsee table.

## 1. Add a Placeholder

Create an empty element where the table should be rendered.

```html
<input id="siteTableFilter" type="text" placeholder="Filter by...">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>
```

The table placeholder id is important. In this example it is `siteTable`.

## 2. Add a Mustache Template

Create a Mustache template that describes each row.

```html
<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
      <th class="tHeader">Image</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{city}}</td>
        <td>{{placename}}</td>
        <td>{{year}}</td>
        <td>{{image}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

By default, Sheetsee looks for a template id that matches the table div id
plus `_template`. For `#siteTable`, the default template id is
`siteTable_template`.

## 3. Match Headers to Data Keys

Sortable headers use the `tHeader` class.

The text inside each `tHeader` should match the spreadsheet column name after
normalizing spaces and capitalization. For example:

- Spreadsheet column: `PlaceName`
- Header text: `Place Name`
- Template value: `{{placename}}`

## 4. Configure the Table

Pass your data and element ids to `Sheetsee.makeTable`.

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

## 5. Enable Pagination

Set `pagination` to the number of rows to show per page.

```js
pagination: 10
```

If `pagination` is omitted, Sheetsee renders all rows at once.

When pagination is enabled, Sheetsee appends navigation markup below the table.
You can style these classes:

```css
.table-pagination {}
.pagination-next {}
.pagination-pre {}
.no-pag {}
```

## 6. Enable Filtering

Filtering requires:

1. An input element.
2. A `filterDiv` option pointing to the input id.
3. A call to `Sheetsee.initiateTableFilter(tableOptions)`.

```html
<input id="siteTableFilter" type="text">
```

```js
filterDiv: '#siteTableFilter'
```

## 7. Complete Example

```html
<input id="siteTableFilter" type="text" placeholder="Filter by...">
<a href="#" class="clear">Clear</a>
<div id="siteTable"></div>

<script id="siteTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
      <th class="tHeader">Image</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{city}}</td>
        <td>{{placename}}</td>
        <td>{{year}}</td>
        <td>{{image}}</td>
      </tr>
    {{/rows}}
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

## Troubleshooting

### Nothing renders

- Confirm `tableDiv` points to an existing element.
- Confirm `templateID` points to an existing template.
- Confirm `data` is an array of row objects.

### Sorting does not work

- Confirm sortable headers use `class="tHeader"`.
- Confirm header text matches the spreadsheet column name.

### Filtering does not work

- Confirm `filterDiv` points to the filter input.
- Confirm `Sheetsee.initiateTableFilter(tableOptions)` is called after
  `Sheetsee.makeTable(tableOptions)`.

### Pagination does not show

- Confirm `pagination` is set to a number.
- Confirm the data has more rows than the pagination size.
