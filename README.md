# Seal Challenge: The Calculated Column

### The Mission
Getting a therapy from lab to patient is choked by **complexity mistaken for rigor**. Paper logs, spreadsheets, and siloed legacy systems slow down proving a process is safe, effective, and ready to scale.

Seal fixes this. We’re an AI-native platform where scientists and engineers build and own their **validated GxP software**—batch records, LIMS, QC dashboards—using composable primitives, Git-style versioning, and centralized review.

When a workflow *is* software it can be tested, simulated, and audited, turning years of paper-driven compliance into days of computation.

This challenge is one of those primitives.

### Your Mission: Build the Calculated Column
See a view **view** of entities from a specific run.

This view is defined by:
1.  A **context object** (`viewContext`) that includes the `runId` and any active filters.
2.  A set of **columns** for this run (`columnsForThisRun`).
3.  An array of **immutable blobs**, where each blob has a `fields` array (`entitiesFromView`).

```ts
// Example entity
{
  id: 'row-42',
  fields: [
    { name: 'runId', type: 'string', value: 'run-81b' },
    { name: 'time', type: 'number', value: 42 },
    { name: 'Cell Density', type: 'number', value: 5.8 },
  ]
}
```

Your component must let a scientist define a new, live-calculated field. It must nail both cases:

| Mode | Example | The Bar |
|------|---------|---------|
| **Simple** | `Total Cells = Cell Density × Volume` | One breath from idea → result |
| **Power** | `if(Density > 5, (Density - lag(Density)) / Δt, null)` | Multi-row, conditionals, helpers—without cluttering the simple path |

### Rules
* **Performance** – UI stays snappy on **1 M+ rows**.
* **Toolkit** – BlueprintJS only (pre-installed).
* **Time** – Aim for **3-4 h**. If you’re past 4, simplify.
* **Focus** – Stub heavy parsing if needed; taste & architecture matter more than regex.

> AI can write React. Taste is on you.

### Ship It
1. Private clone (don’t fork).  
2. Deploy a public preview.  
3. Submit the link via https://forms.gle/E9LASH1Nyhoa3pu48
