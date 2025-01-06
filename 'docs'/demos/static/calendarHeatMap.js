let scn = msc.scene();
let dt = await msc.csv("datasets/csv/calendar_data.csv");

// let rect = scn.mark("rect", { top: 100, left: 200, width: 1000, height: 8, strokeWidth: 1, fillColor: "#ddd" });
// let collection = scn.repeat(rect, dt, {field: "year", layout: msc.layout("grid", { numCols: 1, rowGap: 30 }) });
// let coll = scn.divide(rect, dt, {orientation: "horizontal"});
// scn.setProperties(coll, {layout: undefined});
// scn.encode(coll.firstChild, { field: "amount", channel: "fillColor", scheme: "interpolateYlOrRd" });
// scn.encode(coll.firstChild, { field: "weeknumber", channel: "x", rangeExtent: 600 });
// scn.encode(coll.firstChild, { field: "weekday", channel: "y", rangeExtent: 300 });

let rect = scn.mark("rect", { top: 100, left: 200, width: 12, height: 12, strokeWidth: 0, fillColor: "#ddd" });
let collection = scn.repeat(rect, dt);
scn.classify(collection, { field: "year"});
collection.layout = msc.layout("grid", { numCols: 1, rowGap: 30 });
scn.encode(rect, { field: "amount", channel: "fillColor", scheme: "interpolateYlOrRd" });
scn.encode(rect, { field: "weeknum", channel: "x", rangeExtent: 670 });
let yEnc = scn.encode(rect, { field: "weekday", channel: "y", flipScale: true, rangeExtent: 80 });
yEnc.scale.domain = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

for (let c of collection.children)
    scn.axis("y", "weekday", { orientation: "left", tickVisible: false, pathVisible: false, showTitle: false, item: c.firstChild });
scn.gridlines("y", "weekday");
scn.axis("y", "year", { orientation: "left", tickVisible: false, pathVisible: false, labelFormat: "%Y", pathX: 160});
scn.legend("fillColor", "amount", {x: 950, y: 100});
msc.renderer('svg', 'svgElement').render(scn);


// scn.axis("y", "weekday", {orientation: "left", tickVisible: true, pathVisible: true, showTitle: false, tickValues: [1, 2, 3,4,5,6,7]});
// scn.gridlines("y", "weekday", {values: [1, 2, 3,4,5,6,7]});
// scn.axis("y", "year", {orientation: "left", tickVisible: false, pathVisible: false, labelFormat: "%Y", pathX: 160});
// msc.renderer('svg', 'svgElement').render(scn);