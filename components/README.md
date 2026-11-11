# GDS component contracts

One JSON file per component describes it as data: **DOM anatomy, modifiers, states, accessibility, design rules and canonical examples**. AI agents, docs generators and (later) `gds check` read these files instead of guessing from prose.

For a CSS-only system the DOM structure *is* the API, so `anatomy` lists every element in order with its tag, parent and whether it is required.

| File | Component |
|---|---|
| `table.json` | Data table (incl. bulk-action toolbar, sorting, empty and loading states) |
| `checkbox.json` | Checkbox |
| `badge.json` | Badge (incl. the content-status mapping) |
| `pagination.json` | Pagination and pagination bar |
| `input.json` | Input and textarea |
| `dropdown.json` | Dropdown |
| `component.schema.json` | The contract format (JSON Schema) |

## Rules

Every rule has:

- `principle`: which GDS principle it serves (1 Accessible by default · 2 Reuse before you create · 3 Obvious over documented)
- `autoCheck`: whether a tool can verify it from markup alone
- `removeInV3` (optional): how the system could change so the rule is no longer needed

## Check

```bash
npm run test:components
```

It fails when:

- a file does not match the schema
- a named class is not in the compiled CSS
- a class in the CSS is not documented (each file lists the prefixes it `owns`)
- an example uses an internal class, puts an element outside its parent, misses a required child, or uses a modifier without the modifier it `requires`

These contracts are written by hand: the design decisions (`useWhen`, `rules`, `why`) are the designer's. The check keeps them honest against the CSS.

Covered so far: the six components of a list screen. Next: button, avatar, chip, menu.
