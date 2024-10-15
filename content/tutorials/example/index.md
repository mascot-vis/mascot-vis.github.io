---
title: "0. Let's Create a Diverging Bar Chart"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 5
---

We start this tutorial by creating a diverging bar chart (Figure 1) using Mascot. This chart visualizes a hypothetical dataset reporting people’s opinions on a subject matter, broken down by age (below 30, 30 - 50, 50 - 70, above 70) and responses (strongly agree, agree, disagree, strongly disagree). You can see a demo of this visualization on the [gallery page](/gallery/).

{{< figure src="diverging_bar.png" width="800px" alt="Diverging Bar Chart" caption="Figure 1: Diverging Bar Chart" class="border-0 mx-auto text-center" >}}

Figure 2 shows the dataset "survey_response.csv" behind this visualization. The data table consists of three columns: Age Group, Response, and Percentage (percentage of people with a particular response within an age group).

{{< figure src="data.png" width="350px" alt="Survey Response Dataset" caption="Figure 2: survey_response.csv" class="border-0 mx-auto text-center" >}}

### Initialize Scene and Import Data
To begin, we create a [scene](../../docs/group/scene/), which represents a top-level container, and import the data: 

```js
let scn = msc.scene();
let table = await msc.csv("survey_response.csv");
```

<span style="color:red;font-weight:bold">IMPORTANT</span>: Note that to declare the 'table' object, you need to put the above line of code and any other code that handles the `table` object in an asychronous function, or use the [Promise.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) method to handle the `table` object. For more information, see [here](../../tutorials/initialize/#import-csv-data).

Next, let's create a rectangle in the scene and specify its properties:

```js
let rect = scn.mark("rect", {
  top: 100,
  left: 200,
  width: 700,
  height: 30,
  strokeWidth: 0,
  fillColor: "#ddd",
});
```

Now we can't see the rectangle yet, as it has not been rendered. If you do `console.log(rect)`, you will be able to see the `rect` object in the console. To display it, let's add a line to create a renderer:

    msc.renderer("svg", "svgEle").render(scn);

Here we are creating a renderer that renders the scene to an SVG element with the DOM ID "svgEle". We can see the gray rectangle now:

{{< figure src="rect.png" width="350px" alt="Rectangle Mark" caption="" class="border-0 mx-auto text-center" >}}

### Join Graphics with Data and Lay out Marks

Next, we want to have multiple rectangles, each representing an age group. This is done by using the repeat method:
    
    let collection = scn.repeat(rect, table, {attribute: "Age Group"});

This will give us a collection of four rectangles, each representing an age group in the dataset. By default, the repeated rectangles will have the same properties (including position) as the original rectangle. To space them out, we can apply a grid layout with only 1 column and a vertical gap of 10 pixels between the rows:

    collection.layout = msc.layout("grid", {numCols: 1, rowGap: 10});

This gives us the following visualization:

{{< figure src="repeat.png" width="350px" alt="Repeat and Lay out Rectangle Marks" caption="" class="border-0 mx-auto text-center" >}}

Next, we want to further break down each age group by responses. We can use the divide method:

    let {newBar, bars} = scn.divide(rect, table, {attribute: "Response", orientation: "horizontal"});

which gives us the following visualization:

{{< figure src="divide.png" width="350px" alt="Divide Rectangle Marks" caption="" class="border-0 mx-auto text-center" >}}

When using the divide method, we don't need to pass all four rectangle marks as its argument; we only need to pass in one rectangle `rect` as an example, and Mascot will find all the "peers" of `rect` and perform divide operation on all of them. The divide method will return two visual elements as a result of dividing `rect`: a new bar (`newBar`) serving as an example of the new marks created, and a collection of new bars (`bars`) .

### Specify Visual Encodings

Now we can map data attributes to visual channels. First, let's map "Percentage" to the width of the rectangles. We need to pass the new bar mark as an example to the encode method:

    scn.encode(newBar, {attribute: "Percentage", channel:"width"});

And we can map "Response" to the fill color with a self-defined mapping:

    let colorMapping = {"Strongly agree": "#1e71b8", "Agree": "#7799cf", "Disagree": "#e29d6f",
                        "Strongly disagree": "#da7c43"};
    scn.encode(newBar, {attribute: "Response", channel: "fillColor", mapping: colorMapping});

Here's what we have after applying these encodings:

{{< figure src="encode.png" width="350px" alt="Encode" caption="" class="border-0 mx-auto text-center" >}}

### Apply Constraints

We want to align these bars to clearly show the divergence of opinions. To do so, we find all the light blue bars representing the response "Agree", and align them to the right:

    let agreeBars = scn.findElements([{attribute: "Response", value: "Agree"}]);
    scn.align(agreeBars, "x", "right");

{{< figure src="align.png" width="400px" alt="Encode" caption="" class="border-0 mx-auto text-center" >}}

We can then create some text marks and affix them at the center of the rectangles:

    let text = scn.mark("text", {fillColor: "white"});
    scn.repeat(text, dt);
    scn.encode(text, {attribute: "Percentage", channel: "text"});
    scn.affix(text, newBar, "x");
    scn.affix(text, newBar, "y");  

{{< figure src="text.png" width="420px" alt="Encode" caption="" class="border-0 mx-auto text-center" >}}

### Create Axis and Legend

Finally, let's add a legend and an axis (labels only):

```js
scn.legend("fillColor", "Response", { x: 800, y: 100 });
scn.axis("y", "Age Group", {
  orientation: "left",
  titleVisible: false,
  pathVisible: false,
  tickVisible: false,
});
```

Viola! We have the visualization in Figure 1.

{{< figure src="diverging_bar.png" width="560px" alt="Diverging Bar Chart" caption="" class="border-0 mx-auto text-center" >}}
