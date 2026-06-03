---
title: "Segment"
description: ""
lead: ""
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "basic"
weight: 20
toc: true
---

The Segment class represents a line or a curve that connects two [vertices](../vertex/) in a [path](../../marks/path/). Segments are automatically created when vertices are added to a path. 

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the segment | String |  | 
|**type** <img width="70px" src="../../readonly.png"> | the type of the segment | String | "segment" | 
|**vertex1** <img width="70px" src="../../readonly.png">| the first vertex this segment goes through | [Vertex](../vertex/) |  | 
|**vertex2** <img width="70px" src="../../readonly.png"> | the second vertex this segment goes through | [Vertex](../vertex/) | | 
|**x** <img width="70px" src="../../readonly.png">| the x coordinate of the midpoint of the segment | Number  |
|**y** <img width="70px" src="../../readonly.png">| the y coordinate of the midpoint of the segment | Number  |
{.table-striped}

<!-- ### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| *none* |  |  |
{.table-striped} -->