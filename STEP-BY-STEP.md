# Step-by-step: build a sortable, searchable, paginated table from a spreadsheet

`sheetsee-tables` turns an array of objects (rows) into an HTML table that is
**sortable** (click a header), **searchable** (type to filter) and
**paginated** (N rows per page). It is part of the [Sheetsee.js](http://jlord.us/sheetsee.js)
family and uses [Mustache.js](https://mustache.github.io) templates.

There are two functions and that's it:

- `Sheetsee.makeTable(options)` — render the table.
- `Sheetsee.initiateTableFilter(options)` — enable search/filter.

> A complete, self-contained working example is in [`example/index.html`](example/index.html).
> Open it directly in a browser (no build step, no Google Sheets required) to see it run.

---

## 0. Get the library

Either use the pre-built bundle in this repo:

```html
<script src="dist/sheetsee-tables.js"></script>
```

or build it yourself (this repo is CommonJS + Mustache, so it must be bundled for the browser):

```bash
npm install
npx browserify index.js --standalone Sheetsee -o dist/sheetsee-tables.js
```

---

## 1. Get your data

`makeTable` expects a plain JavaScript array of objects — one object per row.
The keys become the template variables.

**Option A — from a Google Sheet** (the original Sheetsee way, via [Tabletop.js](https://github.com/jsoma/tabletop)):

```js
var data = [];
Tabletop.init({ key: 'YOUR_PUBLIC_SHEET_KEY', callback: function (sheet) {
  data = sheet.all();   // array of objects
  renderTable(data);
}, simpleSheet: true });
```

**Option B — any array of objects** (an API response, a JSON file, etc.):

```js
var data = [
  { city: 'Paris', placename: 'Eiffel Tower', year: '1889' },
  { city: 'London', placename: 'Big Ben', year: '1859' }
];
```

> **Important:** use **lowercase, no-space** keys (`placename`, not `PlaceName`).
> Sorting works by matching a header's text (spaces/punctuation stripped,
> lowercased) to a data key, so the header "Place Name" sorts the `placename` column.

---

## 2. Add a placeholder `<div>` in your HTML

The table is drawn inside an empty `<div>` you provide:

```html
<div id="siteTable"></div>
```

---

## 3. Add a Mustache template

Put your table markup in a `<script type="text/html">` tag. Loop rows with
`{{#rows}} … {{/rows}}`. To make a column sortable, give its `<th>` the class
`tHeader`.

**The template's `id` must equal the placeholder's `id` + `_template`** —
unless you pass `templateID` explicitly (see step 4).

```html
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
          <td>{{city}}</td>
          <td>{{placename}}</td>
          <td>{{year}}</td>
        </tr>
      {{/rows}}
    </tbody>
  </table>
</script>
```

---

## 4. Call `Sheetsee.makeTable(options)`

```js
var tableOptions = {
  data: data,              // array of row objects — REQUIRED
  pagination: 10,          // rows per page; omit to show all rows at once
  tableDiv: '#siteTable',  // the empty div — REQUIRED
  templateID: 'siteTable_template'  // optional; defaults to tableDiv + '_template'
};

document.addEventListener('DOMContentLoaded', function () {
  Sheetsee.makeTable(tableOptions);
});
```

---

## 5. (Optional) add search/filter

Add an input and a "clear" link to your HTML:

```html
<input id="siteTableFilter" type="text" placeholder="filter…">
<a href="#" class="clear">Clear</a>
```

Then pass `filterDiv` in your options and call the second function:

```js
var tableOptions = {
  data: data,
  pagination: 10,
  tableDiv: '#siteTable',
  filterDiv: '#siteTableFilter',  // the input — REQUIRED for filtering
  templateID: 'siteTable_template'
};

document.addEventListener('DOMContentLoaded', function () {
  Sheetsee.makeTable(tableOptions);
  Sheetsee.initiateTableFilter(tableOptions);
});
```

The clear button must use the `.clear` class; it resets the filter and the table.

---

## Full working example

See [`example/index.html`](example/index.html) — it has inline sample data, the
template, the filter, and the bundled library, so it runs by simply opening the
file. Replace the sample `data` array with your own (or wire up Tabletop.js for a
Google Sheet) and you're done.

## Tips / gotchas

- **Sorting** is case/space-sensitive on the *header text* vs the *data key*:
  header "Place Name" ↔ data key `placename`. Don't use spaces in spreadsheet
  column names.
- **Pagination** adds a `<div id="Pagination" class="table-pagination">` under the
  table; style `.pagination-next`, `.pagination-pre` and `.no-pag` in your CSS.
- `data`, `tableDiv`, and (when filtering) `filterDiv` are required — the rest are
  optional.
