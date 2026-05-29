---
title: "DataTable"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "data"
weight: 70
toc: true
---

The DataTable class represents a data table consisting of _tuples_ (rows) and _fields_ (columns). DataTable objects are created by importing Comma Separated Values (CSV) files using the [_csv_ function](../../global/func/):

    let table = await msc.csv("data.csv");

Mascot automatically infers the [data type](../../global/constants/#data-type) for each field/column, and parses the values accordingly

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**name** | the name of the data table, derived from the file name | String | | 
|**attributes** <img width="70px" src="../../readonly.png">| the name of attributes (columns) in the data table | Array | | 
| **nonNumericAttributes** <img width="70px" src="../../readonly.png">| the name of non-numeric attributes (columns) in the data table | Array | | 
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getAttributeType**(f) | returns the type of the specified attribute | [Data Type](../../global/constants/#data-type) |
| **getAttributeSummary**(f) | returns a summary of the specified attribute | Object | 
| **getAttributeValues**(f) | returns an array of values for the specified attribute | Array | 
| **getRowCount**() | returns the number of rows in the table | Number | 
| **getUniqueAttributeValues**(f) | returns an array of unique values for the specified attribute | Array | 
| **hasAttribute**(f) | returns true of the specified attribute exists in the data table | Boolean |
{.table-striped}