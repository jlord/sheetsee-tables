# Sheetsee Tables - Step-by-Step Manual

## What is Sheetsee Tables?

Sheetsee Tables is a JavaScript library that helps you create interactive tables from spreadsheet data. You can make tables that are:
- **Sortable** - Click column headers to sort
- **Searchable** - Filter data with a search box
- **Paginated** - Show data in pages to handle large datasets

## Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- A text editor (VS Code, Sublime Text, etc.)
- A web browser
- A local web server (optional but recommended)

## Step 1: Set Up Your HTML File

Create a new HTML file called `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My Sheetsee Table</title>
    <script src="https://unpkg.com/mustache@latest"></script>
    <script src="https://unpkg.com/sheetsee-tables@latest/index.js"></script>
</head>
<body>
    <!-- Your table will appear here -->
    <div id="myTable"></div>
</body>
</html>
```

## Step 2: Prepare Your Data

Your data should be an array of objects. Each object represents a row, and each property represents a column:

```javascript
var myData = [
    {"Name": "John", "Age": "25", "City": "New York"},
    {"Name": "Jane", "Age": "30", "City": "Los Angeles"},
    {"Name": "Bob", "Age": "35", "City": "Chicago"}
];
```

**Important Notes:**
- Column names should not have spaces (use "FirstName" not "First Name")
- All values should be strings
- Make sure all objects have the same properties

## Step 3: Create Your Table Template

Add a Mustache template inside `<script>` tags. The template defines how your table will look:

```html
<script id="myTable_template" type="text/html">
    <table>
        <tr>
            <th class="tHeader">Name</th>
            <th class="tHeader">Age</th>
            <th class="tHeader">City</th>
        </tr>
        {{#rows}}
        <tr>
            <td>{{Name}}</td>
            <td>{{Age}}</td>
            <td>{{City}}</td>
        </tr>
        {{/rows}}
    </table>
</script>
```

**Key Points:**
- The `id` must end with `_template`
- Use `class="tHeader"` for sortable columns
- Column headers should match your data properties (case-sensitive)
- Use `{{#rows}}` and `{{/rows}}` to loop through data
- Use `{{PropertyName}}` to display data

## Step 4: Add Search Functionality (Optional)

If you want users to search your table, add an input field and clear button:

```html
<input id="myTableFilter" type="text" placeholder="Search...">
<a href="#" class="clear">Clear</a>
<div id="myTable"></div>
```

## Step 5: Initialize Your Table

Add JavaScript to create your table:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    var tableOptions = {
        "data": myData,                    // Your data array
        "pagination": 10,                  // Rows per page (optional)
        "tableDiv": "#myTable",            // Where to put the table
        "filterDiv": "#myTableFilter",     // Search input (optional)
        "templateID": "myTable_template"   // Your template ID
    };
    
    // Create the table
    Sheetsee.makeTable(tableOptions);
    
    // Add search functionality (if you have a search input)
    Sheetsee.initiateTableFilter(tableOptions);
});
```

## Step 6: Style Your Table (Optional)

Add CSS to make your table look better:

```html
<style>
    .tHeader {
        background-color: #f0f0f0;
        cursor: pointer;
        padding: 10px;
    }
    .tHeader:hover {
        background-color: #e0e0e0;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    #Pagination {
        margin: 20px 0;
        text-align: center;
    }
    #Pagination a {
        margin: 0 10px;
        padding: 5px 10px;
        background-color: #007acc;
        color: white;
        text-decoration: none;
    }
</style>
```

## Complete Example

Here's a complete working example:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Complete Example</title>
    <script src="https://unpkg.com/mustache@latest"></script>
    <script src="https://unpkg.com/sheetsee-tables@latest/index.js"></script>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .tHeader { background-color: #f0f0f0; cursor: pointer; padding: 10px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        input { padding: 8px; margin: 10px 0; }
        .clear { margin-left: 10px; padding: 8px 15px; background-color: #dc3545; color: white; text-decoration: none; }
    </style>
</head>
<body>
    <h1>Employee Directory</h1>
    
    <input id="employeeFilter" type="text" placeholder="Search employees...">
    <a href="#" class="clear">Clear</a>
    <div id="employeeTable"></div>

    <script id="employeeTable_template" type="text/html">
        <table>
            <tr>
                <th class="tHeader">Name</th>
                <th class="tHeader">Department</th>
                <th class="tHeader">Salary</th>
                <th class="tHeader">StartDate</th>
            </tr>
            {{#rows}}
            <tr>
                <td>{{Name}}</td>
                <td>{{Department}}</td>
                <td>{{Salary}}</td>
                <td>{{StartDate}}</td>
            </tr>
            {{/rows}}
        </table>
    </script>

    <script>
        var employeeData = [
            {"Name": "Alice Johnson", "Department": "Engineering", "Salary": "$75,000", "StartDate": "2020-01-15"},
            {"Name": "Bob Smith", "Department": "Marketing", "Salary": "$65,000", "StartDate": "2019-03-22"},
            {"Name": "Carol Davis", "Department": "Engineering", "Salary": "$80,000", "StartDate": "2021-06-10"},
            {"Name": "David Wilson", "Department": "Sales", "Salary": "$70,000", "StartDate": "2020-11-05"},
            {"Name": "Eva Brown", "Department": "HR", "Salary": "$60,000", "StartDate": "2018-09-12"}
        ];

        document.addEventListener('DOMContentLoaded', function() {
            var tableOptions = {
                "data": employeeData,
                "pagination": 3,
                "tableDiv": "#employeeTable",
                "filterDiv": "#employeeFilter",
                "templateID": "employeeTable_template"
            };
            
            Sheetsee.makeTable(tableOptions);
            Sheetsee.initiateTableFilter(tableOptions);
        });
    </script>
</body>
</html>
```

## Common Issues and Solutions

### Problem: Table doesn't appear
**Solution:** Check that:
- Your data array is not empty
- The `tableDiv` ID matches your HTML element
- The `templateID` matches your script tag ID
- You're calling `Sheetsee.makeTable()` after the DOM is loaded

### Problem: Sorting doesn't work
**Solution:** Make sure:
- Your table headers have `class="tHeader"`
- Column names in headers match your data properties exactly
- No spaces in your data property names

### Problem: Search doesn't work
**Solution:** Check that:
- You have an input field with the correct ID
- You're calling `Sheetsee.initiateTableFilter()`
- The `filterDiv` option matches your input ID

### Problem: Pagination shows wrong number of pages
**Solution:** Verify that:
- Your `pagination` number is correct
- Your data array has the expected number of items

## Advanced Features

### Custom Styling
You can style the pagination controls using these CSS classes:
- `#Pagination` - The pagination container
- `.pagination-next` - Next page button
- `.pagination-pre` - Previous page button
- `.no-pag` - Disabled pagination buttons

### Working with Real Spreadsheet Data
If you have data from Google Sheets or Excel:
1. Export as CSV
2. Convert to JSON format
3. Use the JSON data in your JavaScript

### Performance Tips
- Use pagination for large datasets (100+ rows)
- Consider server-side filtering for very large datasets
- Minimize the number of columns for better performance

## Next Steps

1. **Try the demo**: Open `working-demo.html` in your browser to see a working example
2. **Experiment**: Modify the example with your own data
3. **Customize**: Add your own CSS styling
4. **Extend**: Add more features like custom sorting or additional filters

## Getting Help

- Check the [GitHub repository](https://github.com/jlord/sheetsee-tables) for issues and discussions
- Look at the source code in `index.js` to understand how it works
- Test your code in the browser's developer console for debugging

## Summary

Sheetsee Tables makes it easy to create interactive tables from your data. The key steps are:
1. Prepare your data as an array of objects
2. Create a Mustache template
3. Set up your HTML structure
4. Initialize the table with JavaScript
5. Add optional features like search and pagination

With these steps, you can create professional-looking, interactive tables for your web applications!