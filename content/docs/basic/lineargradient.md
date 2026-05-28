---
title: "LinearGradient"
description: ""
lead: ""
date: 2021-06-20T14:34:22-04:00
lastmod: 2021-06-20T14:34:22-04:00
draft: false
images: []
menu: 
  docs:
    parent: "basic"
weight: 21
toc: true
---

The LinearGradient class represents a linear color gradient to be used for the stroke or fill color property. To create a LinearGradient object, use the [_linearGradient_ function](../../global/func/):

```js
    let lg = msc.linearGradient({x1: 0, y1: 0, x2: 100, y2: 0});
```


### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**id**| the unique id of the gradient | String | |
|**type**| the type of the gradient | String | "LinearGradient" |
|**x1**| the x coordinate of the start of the gradient, between 0 and 100 | Number | 0 |
|**y1**| the y coordinate of the start of the gradient, between 0 and 100 | Number | 0 |
|**x2**| the x coordinate of the end of the gradient, between 0 and 100 | Number | 100 |
|**y2**| the y coordinate of the end of the gradient, between 0 and 100 | Number | 0 |
|**stops**| the color stops along the gradient | Array | [] |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **addStop**(offset, color, opacity)| adds a color stop to the gradient<br><br>offset (Number): the position of the stop as a number between 0 and 100<br>color (String): the color of the stop<br>opacity (Number): the opacity of the stop as a number between 0 and 1 | void |
| **toJSON**() | returns a JSON representation of the gradient<br><br>`type` (String): the type of the gradient<br>`id` (String): the unique id of the gradient<br>`x1` (Number): x coordinate of the start<br>`y1` (Number): y coordinate of the start<br>`x2` (Number): x coordinate of the end<br>`y2` (Number): y coordinate of the end<br>`stops` (Array): array of stop objects | Object |
{.table-striped}