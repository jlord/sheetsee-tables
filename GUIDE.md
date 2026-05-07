# Sheetsee-Tables — Step-by-Step Setup Guide

> **Note:** The original demos in this repo used [Tabletop.js](https://github.com/jsoma/tabletop) to fetch data from Google Spreadsheets. Google deprecated the API that Tabletop.js relied on in **August 2021**, which is why the demo examples no longer work. This guide explains how to use sheetsee-tables today using static data, a JSON file, or the Google Sheets JSON export workaround.

---

## Table of Contents

1. [Quick Start (Static Data — works immediately)](#1-quick-start-static-data)
2. [Using a Google Sheet via JSON Export](#2-using-a-google-sheet-via-json-export)
3. [Full Working HTML Example](#3-full-working-html-example)
4. [Adding Search / Filter](#4-adding-search--filter)
5. [Adding Pagination](#5-adding-pagination)
6. [Sorting by Column](#6-sorting-by-column)
7. [Common Errors & Fixes](#7-common-errors--fixes)

---

## 1. Quick Start (Static Data)

This approach requires **zero external APIs** and works instantly in any browser.

### Step 1 — Download the required files

```
sheetsee.js     → https://github.com/jlord/sheetsee.js (grab the compiled version)
sss.css         → included in the sheetsee.js repo under /css
mustache.js     → https://github.com/janl/mustache.js
```

Or link them via CDN in your HTML `<head>`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js"></script>
```

### Step 2 — Set up your HTML file

Create an `index.html` file with this structure:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Sheetsee Table</title>
  <link rel="stylesheet" href="sss.css">
</head>
<body>

  <!-- 1. Search input (optional) -->
  <div id="tableFilter">
    <input placeholder="Search...">
  </div>

  <!-- 2. Table placeholder -->
  <div id="myTable"></div>

  <!-- 3. Mustache template for the table rows -->
  <script id="myTable_template" type="text/html">
    <table>
      <tr>
        <th class="tHeader">Name</th>
        <th class="tHeader">City</th>
        <th class="tHeader">Year</th>
      </tr>
      {{#rows}}
      <tr>
        <td>{{name}}</td>
        <td>{{city}}</td>
        <td>{{year}}</td>
      </tr>
      {{/rows}}
    </table>
  </script>

  <!-- 4. Load sheetsee -->
  <script src="sheetsee.js"></script>

  <!-- 5. Your data + table setup -->
  <script>
    // Define your data as a plain JS array of objects
    var myData = [
      { name: "Priya", city: "Pune",    year: "2021" },
      { name: "Rahul", city: "Mumbai",  year: "2019" },
      { name: "Sara",  city: "Delhi",   year: "2023" },
      { name: "Arjun", city: "Chennai", year: "2020" }
    ];

    // Configure the table
    var tableOptions = {
      data:      myData,
      tableDiv:  "#myTable",
      filterDiv: "#tableFilter",
      pagination: 10
    };

    // Build the table
    Sheetsee.makeTable(tableOptions);

    // Enable search/filter
    Sheetsee.initiateTableFilter(tableOptions);
  </script>

</body>
</html>
```

### Step 3 — Open it in your browser

Double-click `index.html` — you'll see a working, searchable, sortable table immediately. No server needed.

---

## 2. Using a Google Sheet via JSON Export

If you want live data from a Google Sheet without Tabletop.js, use Google's built-in JSON export.

### Step 1 — Publish your sheet

1. Open your Google Sheet
2. Go to **File → Share → Publish to web**
3. Choose **Sheet1** and **Comma-separated values (.csv)**, click **Publish**
4. Copy the URL — it looks like:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv
   ```

### Step 2 — Fetch and parse the CSV in JS

```html
<script>
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv";

  fetch(SHEET_URL)
    .then(res => res.text())
    .then(csv => {
      // Parse CSV into array of objects
      const lines  = csv.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const data = lines.slice(1).map(line => {
        const values = line.split(",");
        return headers.reduce((obj, h, i) => {
          obj[h] = values[i] ? values[i].trim() : "";
          return obj;
        }, {});
      });

      // Pass data to sheetsee
      var tableOptions = {
        data:      data,
        tableDiv:  "#myTable",
        filterDiv: "#tableFilter",
        pagination: 10
      };
      Sheetsee.makeTable(tableOptions);
      Sheetsee.initiateTableFilter(tableOptions);
    })
    .catch(err => console.error("Could not fetch sheet:", err));
</script>
```

> **Important:** Your column headers in the template `{{mustache}}` tags must match the Google Sheet headers in **lowercase** (e.g. column `City` → `{{city}}`).

---

## 3. Full Working HTML Example

A copy-paste ready minimal example with sample data:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sheetsee Table Demo</title>
  <style>
    body { font-family: sans-serif; max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
    input { padding: 6px 10px; width: 100%; box-sizing: border-box; margin-bottom: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
    .tHeader { cursor: pointer; background: #f4f4f4; }
    .tHeader:hover { background: #e8e8e8; }
  </style>
</head>
<body>

  <h2>Sheetsee Table — working demo</h2>

  <div id="tableFilter"><input placeholder="Search..."></div>
  <div id="myTable"></div>

  <script id="myTable_template" type="text/html">
    <table>
      <tr>
        <th class="tHeader">Name</th>
        <th class="tHeader">City</th>
        <th class="tHeader">Score</th>
      </tr>
      {{#rows}}
      <tr><td>{{name}}</td><td>{{city}}</td><td>{{score}}</td></tr>
      {{/rows}}
    </table>
  </script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.2.0/mustache.min.js"></script>
  <script src="sheetsee.js"></script>
  <script>
    var data = [
      { name: "Aisha",  city: "Pune",    score: "92" },
      { name: "Rohan",  city: "Mumbai",  score: "85" },
      { name: "Meera",  city: "Delhi",   score: "78" },
      { name: "Vikram", city: "Kolkata", score: "90" },
      { name: "Zara",   city: "Jaipur",  score: "88" }
    ];

    var opts = { data: data, tableDiv: "#myTable", filterDiv: "#tableFilter", pagination: 5 };
    Sheetsee.makeTable(opts);
    Sheetsee.initiateTableFilter(opts);
  </script>

</body>
</html>
```

---

## 4. Adding Search / Filter

Make sure your HTML has a `<div>` with an `<input>` inside it, and pass its id to `filterDiv`:

```html
<div id="tableFilter">
  <input placeholder="Type to search...">
</div>
```

```js
var tableOptions = {
  data: myData,
  tableDiv:  "#myTable",
  filterDiv: "#tableFilter"   // must match the div id above
};
Sheetsee.makeTable(tableOptions);
Sheetsee.initiateTableFilter(tableOptions);  // don't forget this line
```

---

## 5. Adding Pagination

Add a `pagination` number to your options. Sheetsee will automatically add next/prev controls below the table:

```js
var tableOptions = {
  data:       myData,
  tableDiv:   "#myTable",
  pagination: 10            // show 10 rows per page
};
```

Style the auto-generated pagination nav in your CSS:

```css
.paginationDiv { margin-top: 1rem; }
.paginationDiv button { margin-right: 4px; }
```

---

## 6. Sorting by Column

To make a column sortable, give its `<th>` the class `tHeader`. The inner text must **exactly match** (same capitalisation) the key in your data:

```html
<!-- Data key is "city" → th inner text must be "City" (Sheetsee lowercases it internally) -->
<th class="tHeader">City</th>
```

Click the header once to sort ascending, again for descending.

---

## 7. Common Errors & Fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| Table div is empty / blank | Tabletop.js fetch failed (old API) | Switch to static data or CSV fetch as shown above |
| `Sheetsee is not defined` | sheetsee.js not loaded yet | Move your `<script>` tags to just before `</body>` |
| Template not rendering | Template `id` doesn't match `tableDiv` id + `_template` | e.g. if `tableDiv: "#myTable"`, template id must be `myTable_template` |
| Search not working | `initiateTableFilter` not called | Add `Sheetsee.initiateTableFilter(tableOptions)` after `makeTable` |
| Columns not sorting | `<th>` missing `tHeader` class | Add `class="tHeader"` to every sortable `<th>` |
| Data from Google Sheet not loading | Sheet not published publicly | Go to File → Share → Publish to web and republish |


docs: add setup guide

closes jlord/sheetsee-tables#24
---

## Contributing

Found something still broken or outdated? Please [open an issue](https://github.com/jlord/sheetsee-tables/issues) or submit a PR. All improvements welcome!
