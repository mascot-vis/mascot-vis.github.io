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

<span style="font-size:1.2em">Subclasses: [Path](../path/), [Text](../pointtext/), [Image](../image/)</span>


The Mark class represents a primitive building block of a visualization. There are different types of marks, implemented as the child classes of Mark: [Circle](../circle/), [Path](../path/), [Text](../pointtext/), and [Image](../image/). 

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the mark | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the mark | String | ElementType.Mark | 
|**dataScope**| the [data scope](../../data/datascope/) of the mark | [DataScope](../../data/datascope/) | undefined |
|**opacity**| the opacity of the mark (between 0 and 1) | Number | 1 |
|**visibility**| whether the mark is visible ("visible" or "hidden") | String | "visible" |
|**classId** | id for class related to the mark | String | undefined | 
|**bounds** | stores the geometric bounds of the mark | Object | undefined |
|**rotate** | stores the rotation angle of the mark | Number | undefined |
|**refBounds** <img width="70px" src="../../readonly.png">| stores the reference bounds without data encoding applied | Object | undefined |
|**styles**| stores style attributes for the mark | Object | {} |
|**scene** <img width="70px" src="../../readonly.png">| retrieves the scene to which the mark belongs | Scene | |
|**strokeColor**| color of the stroke | String | undefined |
|**strokeWidth**| width of the stroke | Number | undefined |
|**strokeDash**| pattern of dashes for the stroke | Array  | undefined |
|**fillColor**| fill color of the mark | String | undefined |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **contains**(x, y) | whether this mark contains a point<br>x (Number): x coordinate of the point<br>y (Number): y coordinate of the point | Boolean |
| **getScene**() | returns the scene in which this mark resides | [Scene](../../group/scene) |
| **duplicate**() | returns a copy of this mark | [Mark](../mark/) |
| **copyPropertiesTo**(target) | copies the properties of the current mark to another mark object | void |
{.table-striped}