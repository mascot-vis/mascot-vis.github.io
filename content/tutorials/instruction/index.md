---
title: "Usage Instructions"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 1
---

### Using Mascot.js in a web page
Add the following code to the &lt;head&gt; element in your HTML document:
```
<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="https://mascot-vis.github.io/lib/pixi.min.js"></script>
<script src="https://mascot-vis.github.io/dist/mascot-min.js"></script>
```

### Using Mascot.js in an ES6 module
To get the latest version, include "mascot-vis" as a dependency in your package.json file, or do:
```
npm install mascot-vis
```

To import Mascot, do:
```
import * as msc from "mascot-vis"
```