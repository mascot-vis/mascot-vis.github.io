---
title: "PackingLayout"
description: ""
lead: ""
date: 2020-11-12T13:26:54+01:00
lastmod: 2020-11-12T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "layout"
weight: 610
toc: true
---

<span style="font-size:1.2em">extends [Layout](../layout/)</span><br>

The PackingLayout class represents a layout that positions objects by packing them in an area. To create a PackingLayout object and apply it to a [collection](../../group/collection/), use the [_layout_ function](../../global/func/):

    let pl = msc.layout("packing", {x: 100, y: 100});
    collection.layout = pl;

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**type** <img width="70px" src="../../readonly.png"> | the type of the layout | String | "packing" | 
|**group** <img width="70px" src="../../readonly.png">| the group that uses this layout | [Group](../../group/group/) |  |
|**x**| the x coordinate of the center of the enclosing area | Number | 400 |
|**y**| the y coordinate of the center of the enclosing area | Number | 400 |
|**width**| the width of the enclosing area | Number |  |
|**height**| the height of the enclosing area | Number |  |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **clone**() | returns a copy of this layout | [PackingLayout](../packing/) |
{.table-striped}