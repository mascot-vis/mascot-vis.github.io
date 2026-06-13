let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/treemapdata.csv");
let rect = scn.mark("rect", { top: 100, left: 132, width: 85, height: 600, fillColor: "#84BC66", strokeWidth: 0.5, strokeColor: "white" });
let types = msc.repeat(rect, dt, { attribute: "type" });
types.layout = msc.layout("grid", { numRows: 1, colGap: 20 });

let years = msc.repeat(types, dt, { attribute: "year" });
years.layout = msc.layout("grid", { numRows: 1, colGap: 60 });
let continents = msc.divide(rect, dt, { attribute: "continent", orientation: "vertical" });
let countries = msc.divide(continents.firstChild, dt, { attribute: "country", orientation: "horizontal" });

msc.update(continents, {layout: msc.layout("treemap", {width: 85})});
msc.encode(continents, { attribute: "value", channel: "height", rangeExtent: 370 });
msc.encode(countries.firstChild, { attribute: "value", channel: "area" });

msc.encode(countries.firstChild, { attribute: "continent", channel: "fillColor", scheme: "schemeSet2" });
scn.legend("fillColor", "continent", { x: 950, y: 70 });
scn.axis("x", "type", { orientation: "bottom", tickVisible: false, pathVisible: false });
scn.axis("x", "year", { orientation: "bottom", pathY: 475, labelFormat: "%Y", tickVisible: false, labelOffset: 35 });
scn.axis("height", "value", { orientation: "left" });

msc.renderer("svg", "svgEle").render(scn);