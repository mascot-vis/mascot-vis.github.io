---
title: ""
description: ""
lead: ""
date: 2020-10-06T08:49:15+00:00
lastmod: 2020-10-06T08:49:15+00:00
draft: false
images: []
menu: 
  docs:
    parent: "global"
weight: 2
toc: true
---

<!-- ### Helper Functions
| function |  explanation  |  return type |
| --- | --- | --- |
| **msc.cartesianToPolar**(x, y, cx, cy) | converts a point in Cartesian space to polar coordinates<br>x (Number): x coordinate in Cartesian space<br>y (Number): y coordinate in Cartesian space<br>cx (Number): x coordinate of the polar center<br>cy (Number): y coordinate of the polar center | [angele (in degrees),<br>distance from center] |
| **msc.polarToCartesian**(cx, cy, r, deg) | converts a point in polar space to Cartesian coordinates<br>cx (Number): x coordinate of the polar center<br>cy (Number): y coordinate of the polar center<br>r (Number): distance from the polar center<br>deg (Number): angle in degrees in the polar space | [x, y] |
{.table-striped} -->


### Using Mascot.js in a web page
Add the following code to the &lt;head&gt; element in your HTML document:
```
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://mascot-vis.github.io/lib/pixi.min.js"></script>
<script src="https://mascot-vis.github.io/dist/mascot-min.js"></script>
```

Below is an example webpage demonstrating how to create a multi-line chart using Mascot.js

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Mascot example</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://mascot-vis.github.io/dist/mascot-min.js"></script>
</head>
<body>
    <svg id="svgEle" style="width: 100%; height: 99%; margin: 0; padding: 0; position: absolute; top: 0; left: 0; background: white;"></svg>
    <script>
        let scn = msc.scene();
        msc.csv("data/stocks.csv").then((dt)=> {
            let line = scn.mark("line", {x1: 200, y1: 100, x2: 800, y2: 400, strokeColor: "green"});
            let collection = msc.repeat(line, dt, {attribute: "company"});
            let polyLine = msc.densify(line, dt, {attribute: "date"});
            let vertex = polyLine.vertices[0];
            msc.encode(vertex, {attribute: "date", channel: "x", rangeExtent: 600});
            msc.encode(vertex, {attribute: "price", channel: "y"});
            msc.encode(polyLine, {attribute: "company", channel: "strokeColor"});
            scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
            scn.axis("y", "price", {orientation: "left"});
            scn.legend("strokeColor", "company", {x: 850, y: 100});
            msc.renderer('svg','svgEle').render(scn);
        })
    </script>
</body>
</html>
```
<!-- [**Download a demo web app**](https://mascot-vis.github.io/sampleWebApp.zip) showing how to use Mascot.js to create a multi-line graph chart.  -->

### Using Mascot.js in an ES6 module
To get the latest version, include "mascot-vis" as a dependency in your package.json file, or do:
```
npm install mascot-vis
```

To import Mascot, do:
```
import * as msc from "mascot-vis"
```

