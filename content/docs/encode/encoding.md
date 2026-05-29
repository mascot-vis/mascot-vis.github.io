---
title: "Encoding"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "encode"
weight: 200
toc: true
---

An Encoding object records information about a visual encoding. When a mark's visual channel is specified to encode a data attribute through the [_encode_ method](../../group/scene/#methods-encode) in the [Scene](../../group/scene/) class, an Encoding object is created and returned. 

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- | 
|**channel** <img width="70px" src="../../readonly.png">| the [visual channel](../../global/constants/#channel) | String | | 
|**dataTable** <img width="70px" src="../../readonly.png">| the [data table](../../data/datatable) used in this encoding  | String | | 
|**attribute** <img width="70px" src="../../readonly.png">| the data attribute | String | | 
|**aggregator**| [aggregator](../../global/constants/#aggregator) for data values | String |  "sum" | 
|**scales**| the scales of the encoding | Array of [Scale](../scale/) | | 
|**scaleType**| the [type of scale](../../global/constants/#scale-type) | String | depends on<br>attribute and channel | 
|**includeZero**| whether the scale domain includes 0 | Boolean | false |
|**rangeExtent**| the extent of the scale range | Number | |
|**domain**| the domain of the scale | Array | |
|**mapping**| user defined mapping between attribute values and visual properties | Object |  |
|**colorScheme**| the color scheme  | String | |
|**flipScale**| whether to flip the scale | Boolean | false |
|**transform**| transform applied to the encoding | Object | |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getScale**(elem) | get the scale for the specified element<br>elem ([Mark](../../marks/mark/) or [Group](../../group/group/)): the element | [Scale](../scale/) |
| **getRangeExtent**(elem) | get the range extent for the specified element<br>elem ([Mark](../../marks/mark/) or [Group](../../group/group/)): the element | Number |
| **getDomain**(elem) | get the scale domain for the specified element<br>elem ([Mark](../../marks/mark/) or [Group](../../group/group/)): the element | Array |
{.table-striped}
