# Validation

From the repository root, run `npm ci --ignore-scripts`, `npm test`,
`npm run lint`, `npm run bfy`, then `npm start`.

Open http://127.0.0.1:8080/regressions.html. These checks execute the actual
bundle in isolated browser frames, including the generated README example.
All checks should report PASS. A HARNESS ERROR is a failure, not a skipped test.

Also check the main page manually with the supplied five-row sample:

- Two rows on page 1 of 3; Next shows two more, then one on the last page.
- `Dog` shows Boo and Sam on one page. `cat` shows three rows across two pages.
- No matches, `[` and `C++` show no results without exceptions; Clear restores
  the table, and a later normal search works.
- Name sorts case-insensitively in both directions. Sorting while filtered
  retains the filter. All sample cell values are strings.
- The data preview shows exactly the array loaded by the table.
- Tab to Search, Clear and the column headings; Enter/Space sorts a focused
  heading. The example's keyboard handler is not a new library API.
- Convert `test/sample.csv` to a temporary JSON file using the documented
  command and compare it with `test/data.json`. A custom CSV requires a matching
  template and required-field check; it is not a live Google Sheets connection.

`npm test` checks the actual CSV parser/CLI, sample round trip, failure exits
and preservation of output on invalid input. It does not claim browser coverage.
