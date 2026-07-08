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
for each attribute and parses values into the inferred type. When a table is
initialized, Mascot also adds an internal row identifier named `mascot_rowId`.
This row id is used internally by data-driven operations such as repeat, divide,
and densify when no explicit attribute is provided.

### Properties

| property |  explanation   | type | default value |
| --- | --- | --- | --- |
| **attributes** <img width="70px" src="../../readonly.png"> | names of the attributes (columns) in the data table | Array | |
| **data** <img width="70px" src="../../readonly.png"> | parsed row objects in the table | Array | |
| **id** <img width="70px" src="../../readonly.png"> | unique id of the data table | String | |
| **name** <img width="70px" src="../../readonly.png"> | name of the data table, derived from the file name when the table is imported from a URL | String | |
| **nonNumericAttributes** <img width="70px" src="../../readonly.png"> | attributes not inferred as Number or Integer | Array | |
| **numericAttributes** <img width="70px" src="../../readonly.png"> | attributes inferred as Number or Integer | Array | |
| **url** | URL or path used to create the table | String | |
{.table-striped}

### Methods

| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() | returns a copy of the table with the same parsed data and attribute types | [DataTable](../../data/datatable/) |
| **getAttributeSummary**(attr) | returns a summary of the specified attribute. Numeric and date attributes include `min`, `max`, `extent`, and `unique`; numeric attributes also include `mean` and `median`; string attributes include `unique`; boolean attributes include `trueCount` and `falseCount` | Object |
| **getAttributesByType**(type) | returns all attributes with the specified [data type](../../global/constants/#data-type) | Array |
| **getAttributeType**(attr) | returns the inferred type of the specified attribute | [Data Type](../../global/constants/#data-type) |
| **getAttributeValues**(attr) | returns the values of the specified attribute for every row in the table | Array |
| **getEncodableAttributes**(channel) | returns attributes that can be encoded by the specified visual channel. For channels such as `x`, `y`, `width`, `height`, `radius`, `fillColor`, `strokeColor`, and `text`, Mascot returns both numeric and non-numeric attributes. For channels such as `area` and `strokeWidth`, Mascot returns numeric attributes | Array |
| **getRawValue**(attr, value) | returns the original raw value for a parsed date value; for non-date attributes, returns the value unchanged | Any |
| **getRowCount**() | returns the number of rows in the table | Number |
| **getUniqueAttributeValues**(attr) | returns the unique values of the specified attribute | Array |
| **hasAttribute**(attr) | returns true if the specified attribute exists in the data table | Boolean |
| **orderAttributeValues**(attr, values) | sets the stored order of unique values for the specified attribute. This is useful when a categorical attribute should follow a custom order | void |
| **parseAttributeAsDate**(attr, format) | parses the specified attribute as dates using a [d3 time format string](https://d3js.org/d3-time-format#locale_format). Parsed dates are stored internally as millisecond timestamps | void |
| **summarize**() | recomputes attribute summaries for the current table data | void |
{.table-striped}

### Examples

#### Inspect table attributes

```js
let table = await msc.csv("cars.csv");

table.attributes;
table.numericAttributes;
table.nonNumericAttributes;
table.getRowCount();
```

#### Check an attribute before using it

```js
if (table.hasAttribute("weight(lbs)")) {
    let values = table.getAttributeValues("weight(lbs)");
    let summary = table.getAttributeSummary("weight(lbs)");
}
```

#### Parse a date attribute

```js
let table = await msc.csv("stocks.csv");
table.parseAttributeAsDate("date", "%b %Y");
```

#### Transform table data

Data transformations are applied through the [Scene](../../group/scene/) class,
not directly through DataTable:

```js
let scene = msc.scene();
let table = await msc.csv("car-weight.csv");
let density = scene.transform("kde", table, {
    attribute: "weight(lbs)",
    newAttribute: "weight_density",
    min: 1500,
    interval: 100,
    bandwidth: 10
});
```
