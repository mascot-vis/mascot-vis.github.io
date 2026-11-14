---
title: "SpiralTrajectory"
description: ""
lead: ""
date: 2026-08-02T13:26:54+01:00
lastmod: 2026-08-02T13:26:54+01:00
draft: false
images: []
menu:
  docs:
    parent: "guide"
weight: 760
toc: true
---

<span style="font-size:1.2em">extends [Path](../../marks/path/)</span><br>

The SpiralTrajectory class represents the Archimedean spiral curve a [SpiralLayout](../../layout/spiral/) places its children along -- a pure visual guide, drawn from the same `radius(t) = startRadius + radiusStep * t`, `angle(t) = startAngle + direction * angleStep * t` formula the layout itself uses, just sampled densely instead of once per child. It never affects layout or data, and it recomputes automatically whenever the collection's children are repositioned (e.g. after the data or the layout's parameters change). To create a SpiralTrajectory, use the [_trajectory_ method](../../group/scene/#methods-create-guides) in the [Scene](../../group/scene/) class, passing the laid-out collection (or any mark inside it):

    let traj = scene.trajectory(collection);

### Properties
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**collection** <img width="70px" src="../../readonly.png">| the collection whose spiral layout this trajectory traces | Collection | |
|**extendPastLast**| how many extra "child steps" worth of curve to draw past the last child (e.g. 1 continues the curve exactly one more step outward) | Number | 0 |
|**id** <img width="70px" src="../../readonly.png">| the unique id of the trajectory | String | |
|**points** <img width="70px" src="../../readonly.png">| the sampled `{x, y}` points making up the curve | Array | |
|**samplesPerStep**| how many points to sample between consecutive children -- higher looks smoother but produces a longer `d` string | Number | 12 |
|**type** <img width="70px" src="../../readonly.png"> | the type of the trajectory | String | "trajectory" |
{.table-striped}

### Properties inherited from Path
| property |  explanation   | type | default value |
| --- | --- | --- | --- |
|**bounds** <img width="70px" src="../../readonly.png">| the bounding rectangle of the trajectory | [Rectangle](../../basic/rectangle/) | |
|**fillColor**| the fill color of the trajectory path | Color | "none" |
|**strokeColor**| the stroke color of the trajectory | Color | "#bbb" |
|**strokeDash**| the dashes and gaps for the trajectory stroke | String | "none" |
|**strokeWidth**| the stroke width of the trajectory in pixels | Number | 1 |
{.table-striped}

### Methods
| method |  explanation   | return type |
| --- | --- | --- |
| **getSVGPathData**() | returns a string to be used as the `d` parameter in an SVG path element | String |
{.table-striped}

Note that the trajectory is drawn behind the collection's own marks (so points/icons placed by the spiral appear to sit on top of the curve), and only `SpiralLayout` is supported -- `CircularLayout`'s "trajectory" would just be the circle implied by its evenly-spaced points, which is rarely useful as a drawn guide.
