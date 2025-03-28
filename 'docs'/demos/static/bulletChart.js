let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/Revenue.csv");

let rect1 = scn.mark("rect", {top: 110, left: 200, width: 600, height: 40, fillColor: "#eee", strokeWidth: 0})
let rect2 = scn.mark("rect", {top: 110, left: 200, width: 580, height: 40, fillColor: "#ddd", strokeWidth: 0})
let rect3 = scn.mark("rect", {top: 110, left: 200, width: 560, height: 40, fillColor: "#ccc", strokeWidth: 0})

let measure = scn.mark("rect", {top: 125, left: 200, width:200, height: 10, fillColor: "steelblue",  strokeWidth: 0});

let marker = scn.mark("line", {x1: 200, y1: 115, x2: 200, y2: 145, strokeColor: "red", strokeWidth: 3});

let glyph = scn.glyph(rect1, rect2, rect3, measure, marker);
//let glyph = scn.glyph(rect1, rect2);

let collection = scn.repeat(glyph, dt, {attribute: "Region"});

collection.layout = msc.layout("grid", {numCols: 1, rowGap: 25});

let enc = scn.encode(rect1.rightSegment, {attribute: "Good", channel:"x"});
scn.encode(rect2.rightSegment, {attribute: "Satisfactory", channel:"x", shareScale: enc});
scn.encode(rect3.rightSegment, {attribute: "Poor", channel:"x", shareScale: enc});
scn.encode(measure.rightSegment, {attribute: "Measure", channel:"x", shareScale: enc});

scn.encode(marker, {attribute: "Target", channel:"x", shareScale: enc});
scn.axis("x", "Good", {orientation: "bottom", title: "Sales"});
scn.axis("y", "Region", {orientation: "left", pathVisible: false, tickVisible: false, titleVisible: false});

// let enc = scn.encode(rect1,{attribute: "Good", channel:"width"});
// scn.encode(rect2,{attribute: "Satisfactory", channel:"width", shareScale: enc});
// scn.encode(rect3,{attribute: "Poor", channel:"width", shareScale: enc});
// scn.encode(measure,{attribute: "Measure", channel:"width", shareScale: enc});
