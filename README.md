# sheetsee-tables

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Sheetsee.js uses this module to make tables. With this module you can create tables with your spreadsheet data that are sortable, searchable and paginated.

## Quick Start (5 minutes)

This guide walks you through creating a table from spreadsheet data.

### What You Need

1. A Google Spreadsheet published to the web
2. [Tabletop.js](https://github.com/jsoma/tabletop) to fetch the data
3. A HTML page with a template and a placeholder `<div>`

### Step-by-Step

#### 1. Set Up Your Spreadsheet

Create a Google Sheet with headers in the first row (e.g., `City`, `Place Name`, `Year`). Publish it: **File → Share → Publish to web**.

#### 2. HTML Setup

Create an `index.html` with:

```html
<!-- Placeholder where the table will be rendered -->
<div id="myTable"></div>

<!-- Your Mustache template — the id should match the placeholder with "_template" suffix -->
<script id="myTable_template" type="text/html">
  <table>
    <tr>
      <th class="tHeader">City</th>
      <th class="tHeader">Place Name</th>
      <th class="tHeader">Year</th>
    </tr>
    {{#rows}}
      <tr>
        <td>{{city}}</td>
        <td>{{placename}}</td>
        <td>{{year}}</td>
      </tr>
    {{/rows}}
  </table>
</script>
```

> ⚠️ **Important**: Your table header text must match your spreadsheet column names (case-sensitive, but spaces are OK).
> - ✅ Spreadsheet: `PlaceName` → Template: `Place Name`
> - ❌ Spreadsheet: `PlaceName` → Template: `PLACENAME`

#### 3. Add the Script

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/tabletop.js/1.5.1/tabletop.min.js"></script>
<script src="bundle.js"></script>
<script>
  // Fetch data from your spreadsheet
  Tabletop.init({
    key: 'YOUR_SPREADSHEET_ID',
    callback: function(data) {
      var tableOptions = {
        "data": data,
        "pagination": 10,
        "tableDiv": "#myTable",
        "filterDiv": "#myTableFilter",     // optional, for search
        "templateID": "myTable_template"
      }
      Sheetsee.makeTable(tableOptions)

      // Optional: enable search/filter
      Sheetsee.initiateTableFilter(tableOptions)
    },
    simpleSheet: true
  })
</script>
```

> 🔍 **Where to find your Spreadsheet ID**: Look at the URL of your Google Sheet — 
> `https://docs.google.com/spreadsheets/d/`**1ABC123...**`/edit` — the long string in the middle is your key.

#### 4. Add Search (Optional)

Add an input field to your HTML:

```html
<input id="myTableFilter" type="text" placeholder="Filter rows...">
<a href="#" class="clear">Clear</a>
```

The search will filter across all columns automatically.

#### 5. View the Result

Open your `index.html` in a browser. You should see a table with sorting (click headers), pagination (if `pagination` is set), and filtering (if configured).

---

## Live Demo

Open [`demo/demo.html`](./demo/demo.html) in your browser to see a working example with sample data.

[![Demo Screenshot](./demo/screenshot.png)](./demo/demo.html)

---

## Your HTML Placeholder

This is as simple as an empty `<div>` with an `id`.

```html
<div id="myTable"></div>
```

## Your Template

Your template is the mockup of what you'd like your table to look like and what content it should show. The style is up to you! It is a [mustache](https://mustache.github.io) template inside of `<script>` tags.

**The `id` of the template should be the same as the HTML placeholder it corresponds to but with `_template` on the end.**

### Sorting

If you want users to be able to click on headers and sort that column, your template must include table headers with the class `tHeader`.

You can then style `.tHeader` in your CSS to make them look how you want.

**Note:** The column name in your spreadsheet headers should not contain spaces, even if your table header text does.

## Methods

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

```HTML
<div id='Pagination' currentPage class='table-pagination'>
  Showing page {{currentPage}} of {{totalPages}}
  <a class='pagination-pre'>Previous</a><a class='pagination-next'>Next</a>
</div>
```

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

---

_[Visit Site](http://jlord.us/sheetsee.js)_
