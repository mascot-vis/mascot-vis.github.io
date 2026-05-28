---
title: "Mark"
description: ""
lead: ""
date: 2021-06-20T20:24:35-04:00
lastmod: 2021-06-20T20:24:35-04:00
draft: false
images: []
menu:
  docs:
    parent: "marks"
weight: 22
toc: true
---

<span style="font-size:1.2em">Subclasses: [Path](../path/), [Circle](../circlepath/), [Text](../pointtext/), [Image](../image/)</span>


The Mark class represents a primitive building block of a visualization. There are different types of marks, implemented as the child classes of Mark: [Path](../path/), [Circle](../circlepath/), [Text](../pointtext/), and [Image](../image/).

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the mark | [Rectangle](../../basic/rectangle/) | |
|**dataScope**| the [data scope](../../data/datascope/) of the mark | [DataScope](../../data/datascope/) | undefined |
|**fillColor**| the fill color of the mark | Color | undefined |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the mark | String |  |
|**opacity**| the opacity of the mark (between 0 and 1) | Number | 1 |
|**strokeColor** | the stroke color of the mark | Color | undefined |
|**strokeDash** | the dashes and gaps for the mark stroke | String | undefined |
|**strokeWidth** | the stroke width of the mark in pixels | Number | undefined |
|**type** <img width="70px" src="../../readonly.png"> | the type of the mark | String | |
|**visibility**| whether the mark is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}
