---
title: "Text"
description: ""
lead: ""
date: 2021-06-20T20:25:40-04:00
lastmod: 2021-06-20T20:25:40-04:00
draft: false
images: []
menu:
  docs:
    parent: "marks"
weight: 50
toc: true
---
<span style="font-size:1.2em">extends [Mark](../mark/)</span><br>

The Text class represents a text element. To create a Text object, use the _mark_ method in the [Scene](../../group/scene) class, for example:
```js
    let txt = scene.mark("text", {x: 50, y: 100, text: "hello"});
```

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**anchor** | the anchor of this text (Figure 1) | Array | ["center", "middle"] |
|**backgroundColor** | the background color of the text box | Color | "#fff" |
|**borderColor** | the border color of the text box | Color | "#ccc" |
|**borderWidth** | the border width of the text box in pixels | Number | 1 |
|**fontFamily** | the font family of the text | String | "Arial, sans-serif" |
|**fontSize** | the font size of the text | String | "12px" |
|**fontWeight** | the font weight of the text | String | "normal" |
|**text** | the text content | String | "" |
|**textPath** | the path the text follows | [Path](../path/) | undefined |
|**textPathOffset** | the offset along the text path | String | "50%" |
|**x** | the x coordinate of the anchor | Number | 0 |
|**y** | the y coordinate of the anchor | Number | 0 |
{.table-striped}

{{< figure src="../anchor.png" alt="text anchor" caption="Figure 1: Different anchor properties with the same x and y properties (the orange dot) lead to different text positions." class="border-0 mx-auto text-center">}}

### Properties inherited from Mark
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the text | [Rectangle](../../basic/rectangle/) | |
|**dataScope**| the [data scope](../../data/datascope/) of the text | [DataScope](../../data/datascope/) | undefined |
|**fillColor** | the color of the text | Color | "black" |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the text | String | |
|**opacity** | the opacity value of the text (between 0 and 1) | Number | 1 |
|**strokeColor** | the stroke color of the text | Color | undefined |
|**strokeDash** | the dashes and gaps for the text stroke | String | undefined |
|**strokeWidth** | the stroke width of the text in pixels | Number | undefined |
|**type** <img width="70px" src="../../readonly.png"> | the type of the text | String | "text" |
|**visibility**| whether the text is visible ("visible" or "hidden") | String | "visible" |
{.table-striped}
