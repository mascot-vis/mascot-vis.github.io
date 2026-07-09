---
title: "Table"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "datasets"
weight: 70
toc: true
---

The DataTable class represents tabular data in Mascot. A data table consists of
_tuples_ (rows) and _attributes_ (columns). DataTable objects are usually created
by importing Comma Separated Values (CSV) files using the
[_csv_ function](../../global/func/):

```js
let table = await msc.csv("data.csv");
```

Mascot automatically infers the [data type](../../global/constants/#data-type)
for each attribute and parses values into the inferred type. Small integer values
in a column named `year` are treated as dates. When a table is initialized,
Mascot also adds an internal row identifier named `mascot_rowId`, exposed as
`msc.ROW_ID`. This row id is used internally by data-driven operations such as
repeat, divide, densify, and aggregate encodings when no explicit attribute is
provided.

### Properties

| property |  explanation   | type | default value |
| --- | --- | --- | --- |
| **data** <img width="70px" src="../../readonly.png"> | parsed row objects in the table | Array | |
| **dimensions** <img width="70px" src="../../readonly.png"> | non-numeric attributes, sorted by the number of unique values | Array | |
| **id** <img width="70px" src="../../readonly.png"> | unique id of the data table | String | |
| **measures** <img width="70px" src="../../readonly.png"> | attributes inferred as Number or Integer | Array | |
| **name** <img width="70px" src="../../readonly.png"> | name of the data table, derived from the file name when the table is imported from a URL | String | |
| **url** | URL or path used to create the table | String | |
{.table-striped}

### Methods

| method |  explanation   | return type |
| --- | --- | --- |
| **addAttr**(name, type, values) | adds an attribute to the table, or updates the attribute if it already exists. The `values` array should contain one value for each row | void |
| **attrs**(type) | returns all attribute names when `type` is omitted; otherwise returns attributes with the specified [data type](../../global/constants/#data-type) | Array |
| **clone**() | returns a copy of the table with the same parsed data and attribute types | [DataTable](../../data/datatable/) |
| **count**() | returns the number of rows in the table | Number |
| **encodable**(channel) | returns attributes that can be encoded by the specified visual channel. For channels such as `x`, `y`, `width`, `height`, `radius`, `fillColor`, `strokeColor`, and `text`, Mascot returns both measures and dimensions. For channels such as `area` and `strokeWidth`, Mascot returns measures | Array |
| **has**(attr) | returns true if the specified attribute exists in the data table | Boolean |
| **load**(rows) | replaces the table's current rows and recomputes cached summaries | void |
| **order**(attr, values) | sets the stored order of unique values for the specified attribute. This is useful when a categorical attribute should follow a custom order | void |
| **parseDate**(attr, format) | parses the specified attribute as dates using a [d3 time format string](https://d3js.org/d3-time-format#locale_format). Parsed dates are stored internally as millisecond timestamps | void |
| **raw**(attr, value) | returns the original raw value for a parsed date value; for non-date attributes, returns the value unchanged | Any |
| **rows**(filters) | returns rows matching the given filters. Filters can be exact values, arrays of accepted values, or interval objects with `min` and/or `max` | Array |
| **summarize**() | recomputes attribute summaries for the current table data | void |
| **summary**(attr) | returns a summary of the specified attribute. Numeric and date attributes include `min`, `max`, `extent`, and `unique`; numeric attributes also include `mean` and `median`; string attributes include `unique`; boolean attributes include `trueCount` and `falseCount` | Object |
| **type**(attr) | returns the inferred type of the specified attribute | [Data Type](../../global/constants/#data-type) |
| **unique**(attr) | returns the unique values of the specified attribute | Array |
| **values**(attr) | returns the values of the specified attribute for every row in the table | Array |
{.table-striped}

### Examples

#### Inspect table attributes

```js
let table = await msc.csv("cars.csv");

table.attrs();
table.measures;
table.dimensions;
table.count();
```

#### Check an attribute before using it

```js
if (table.has("weight(lbs)")) {
    let type = table.type("weight(lbs)");
    let values = table.values("weight(lbs)");
    let summary = table.summary("weight(lbs)");
}
```

#### Filter rows

```js
let carsFromJapan = table.rows({ Origin: "Japan" });
let smallerCars = table.rows({ "weight(lbs)": { max: 2500 } });
let selectedCars = table.rows({ Origin: ["Japan", "Europe"] });
```

#### Parse a date attribute

```js
let table = await msc.csv("stocks.csv");
table.parseDate("date", "%b %Y");
```

#### Transform table data

Data transformations are specified with `msc.transform(...)` and applied through
the [Scene](../../group/scene/) class, not directly through DataTable:

```js
let scene = msc.scene();
let table = await msc.csv("car-weight.csv");
let density = scene.derive(table, msc.transform("kde", {
    attribute: "weight(lbs)",
    newAttribute: "weight_density",
    min: 1500,
    interval: 100,
    bandwidth: 10
}));
```
