---
title: "1. Overview of Component Model"
description: ""
lead: ""
date: 2020-10-13T15:21:01+02:00
lastmod: 2020-10-13T15:21:01+02:00
draft: false
images: []
menu:
  tutorials:
    parent: "tutorials"
weight: 10
---
Every visualization created using Mascot can be described as the composition of four types of semantic components: *visual object*, *layout*, *encoding & scale*, and *constraint*.

### Visual Object
Mascot.js provides abstractions for the following types of visual objects, starting from the lowest level of the scene graph hierarchy:

- **Mark**: basic graphical element in a visualization. A mark can be a geometric shape (e.g., circle, polygon), a text element, or an image (e.g., an icon).

- **Collection**: a group of visual objects, each representing a data item. For example, in Figure 1(a), we have a bar chart, where the main content is a collection of twelve rectangle marks. Each rectangle represents a month. 
  
- **Glyph**: a group of marks where all the marks inside the glyph represent the same item. In Figure 1(b), we have a box plot, where the main content is a collection of five glyphs. Each glyph consists of multiple marks (i.e., a rectangle and lines), and all the marks in each glyph depicting different attributes (e.g., max, min, 75th percentile) of the same data item (a pay grade)
  
- **Reference Object**: axes and legends provide contextual information on how to read a visualization; gridlines facilitate reading and estimating data values in a visualization.

- **Scene**: a self-contained view consisting of mark/glyph collections and reference objects like axes and legend.

Figure 1(c) shows how these visual objects are organized in a visualization. Note that a collection can be nested, e.g., the children of a collection are also collections.

{{< figure src="collection_glyph.png" alt="Visual Objects" width="850px" caption="Figure 1: (a) bar chart as a collection of bars, (b) glyphs in a box-and-whiskers plot, (c) object hierarchy" class="border-0 mx-auto text-center">}}


### Parametric Layout
The positions of visual objects in a collection are often determined by [parametric layouts](../../docs/layout/layout). For example, we can consider the rectangles in Figure 1(a) as laid out in a grid from left to right. Mascot currently supports four types of layout: grid, stack, packing, and treemap. Each layout has a number of parameters whose values can be adjusted. 

### Encoding & Scale
A [visual encoding](../encode/) specifies the mapping between a visual channel and a data field. For example, In Figure 1(a), the height (visual channel) of each rectangle encodes sales value. Related to encoding is the [scale](../../docs/encode/scale) component, which specifies *how* the data values map to the properties of a visual channel. 

### Constraint
[Constraints](../constraints/) are requirements on the relative spatial arrangements of visual objects. For example, we can align visual objects to the left, or specify that the top left corner of a rectangle should always be 5 pixels apart from the bottom right corner of a text element.


<!-- At the top level, we have a scene, acting as a container for all the visualization objects. In a scene, we typically have axes, legends, gridlines, and collections of items. A collection can be nested, e.g., the children of a collection are also collections. A collection consists of multiple marks or glyphs; where each glyph is essentially a group of marks. Finally, a mark is typically represented as a set of vertices, connected by line or curve segments. For example, a rectangle mark is composed of four vertices connected by four line segments.  -->

### Example: Semantic Components in a Diverging Bar Chart

{{< figure src="diverging_bar.png" alt="a Diverging Bar Chart" width="700px" caption="" class="border-0 mx-auto text-center">}}

In the diverging bar chart above, we have four top-level <span style="color:#956900">visual objects</span> in the scene: a legend, an axis with labels only, a collection of text elements, and a nested collection of rectangle marks. Inside the last collection, there are four collections of rectangles, each collection representing an age group and consisting of four rectangles. 

The nested collection uses two <span style="color:#548235">parametric layouts</span>: a grid layout placing the rectangle collections in four rows with 10px gaps between them, and a stack layout within each collection of rectangles. 

There are three <span style="color:#4472C4">visual encodings</span> in this chart: the width of each rectangle encodes the percentage values, and the fill color encodes the response type. In addition, the content of each text element encodes the percentage values. 

Finally, the chart includes two <span style="color:#D853D6">constraints</span>: the light blue rectangles are *aligned* to the right to better show the divergence of opinions, and the text elements are *affixed* to the center of the rectangles. 


{{< figure src="diverging_msc.png" alt="Semantic Components of a Diverging Bar Chart" width="550px" caption="Figure 2: Semantic Components of a Diverging Bar Chart" class="border-0 mx-auto text-center">}}

In the following sections of the tutorial, we discuss how to create and manipulate these semantic components using the operations provided by Mascot. 

<!-- {{< figure src="diverging_vom.png" width="650px" alt="Semantic Components in a Diverging Bar Chart" caption="Visualization Object Model of a Diverging Bar Chart" class="border-0 mx-auto text-center">}} -->

<!-- In the box plot in Figure 2, we have two top-level components in the scene: an axis without ticks or path, and a collection of four box-and-whiskers glyphs. Inside each glyph, there are multiple marks in the form of rectangle and lines.

{{< figure src="box_vom.png" width="850px" alt="Visualization Object Model of a Box Plot" caption="Figure 2: Visualization Object Model of a Box Plot" class="border-0 mx-auto text-center">}} -->
