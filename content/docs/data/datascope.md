---
title: "DataScope"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "data"
weight: 75
toc: true
---

The DataScope class represents data that is joined with a graphical object (i.e., [mark](../../marks/mark/) or [group](../../group/group/)). A DataScope object contains a subset of the tuples in a [data table](../datatable/). DataScope objects are created and assigned to graphical objects through the [_repeat_, _divide_, and _densify_ methods](../../group/scene/#methods-join-graphics-with-data) in the [Scene](../../group/scene/) class.

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**dataTable** <img width="70px" src="../../readonly.png">| the data table from which this data scope is created | [DataTable](../datatable) |  | 
|**filters** <img width="70px" src="../../readonly.png"> | returns attribute values used to filter a data table<br>into the current data scope  | Dictionary |  |
|**attributes** <img width="70px" src="../../readonly.png">| the attribute names in the filters | Array of Strings |  | 
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
|**clone**() | returns a copy of the data scope | [DataScope](../datascope/) | 
|**aggregateNumericalAttribute**(f, aggr) | aggregate the values of the specified numeric attribute in this data scope<br>f (String): attribute<br>aggr (String): [aggregator](../../global/constants/#aggregator) | Number |
|**getAttributeType**(f) | returns the type of the specified attribute in this data scope | [Data Type](../../global/constants/#data-type) | 
|**getAttrVal**(f) | returns the value of the specified attribute in this data scope | | 
| **hasAttribute**(f) | returns true of the specified attribute exists in the data scope | Boolean |
|**isEmpty**() | returns true if the data scope contains no tuples | Boolean |
{.table-striped}
