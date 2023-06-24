let scn = msc.scene();
let dt = await msc.csv("datasets/csv/treemapdata.csv");
let rect = scn.mark("rect", { top: 100, left: 132, width: 85, height: 600, fillColor: "#84BC66", strokeWidth: 0.5, strokeColor: "white" });
let types = scn.repeat(rect, dt, { field: "type" });
types.layout = msc.layout("grid", { numRows: 1, colGap: 20 });

let years = scn.repeat(types, dt, { field: "year" });
years.layout = msc.layout("grid", { numRows: 1, colGap: 60 });
let continents = scn.divide(rect, dt, { field: "continent", orientation: "vertical" });
let countries = scn.divide(continents.firstChild, dt, { field: "country", orientation: "horizontal" });

scn.setProperties(continents, {layout: msc.layout("treemap", {width: 85})});
scn.encode(continents, { field: "value", channel: "height", rangeExtent: 370 });
scn.encode(countries.firstChild, { field: "value", channel: "area" });

scn.encode(countries.firstChild, { field: "continent", channel: "fillColor", scheme: "schemeSet2" });
scn.legend("fillColor", "continent", { x: 950, y: 70 });
scn.axis("x", "type", { orientation: "bottom", tickVisible: false, pathVisible: false });
scn.axis("x", "year", { orientation: "bottom", pathY: 475, labelFormat: "%Y", tickVisible: false, labelOffset: 35 });
scn.axis("height", "value", { orientation: "left" });

msc.renderer("svg", "svgEle").render(scn);