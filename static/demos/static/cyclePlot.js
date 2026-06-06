let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/co2-concentrations.csv");
let line1 = scn.mark("line", {x1: 100, y1: 200, x2: 180, y2: 600, strokeWidth: 3}),
    line2 = scn.mark("line", {x1: 100, y1: 250, x2: 180, y2: 250, strokeWidth: 3});

let glyph = scn.glyph(line1, line2);
let coll = msc.repeat(glyph, dt, {attribute: "Decade", layout: msc.layout("grid", {"numRows": 1, "colGap": 30})});

let polyLine = msc.densify(line1, dt, {attribute: "Date"});
let vertex = polyLine.vertices[0];
let xEnc = msc.encode(vertex, {attribute: "Scaled Date", channel: "x"});
let yEnc = msc.encode(vertex, {attribute: "CO2", channel: "y"});

msc.encode(line2, {channel: "y", attribute: "CO2", shareScale: yEnc, aggregator: "mean"});
msc.encode(line2.vertices[0], {channel: "x", attribute: "Scaled Date", aggregator: "min", shareScale: xEnc});
msc.encode(line2.vertices[1], {channel: "x", attribute: "Scaled Date", aggregator: "max", shareScale: xEnc});

let enc = msc.encode(polyLine, {attribute: "Decade", channel: "strokeColor", scheme: "schemeSpectral"});
enc.domain = enc.getScale(polyLine).domain.sort((a,b) => b.localeCompare(a));

scn.axis("x", "Decade", {orientation: "bottom", pathVisible: false});
scn.axis("y", "CO2", {orientation: "left", pathVisible: false});
scn.gridlines("y", "CO2", {"strokeColor": "#eee"});
scn.legend("strokeColor", "Decade", {x: 990, y: 100});

// let line = scn.mark("line", {x1: 100, y1: 200, x2: 580, y2: 600, strokeWidth: 3});
// let collection = msc.divide(line, dt, {attribute: "Decade", layout: msc.layout("grid", {"numRows": 1, "colGap": 30})});
// let polyLine = msc.densify(collection.firstChild, dt, {attribute: "Date"});

// let vertex = polyLine.vertices[0];
// let xEnc = msc.encode(vertex, {attribute: "Scaled Date", channel: "x"});
// let yEnc = msc.encode(vertex, {attribute: "CO2", channel: "y"});
// yEnc.scale.rangeExtent = 400;
// let enc = msc.encode(polyLine, {attribute: "Decade", channel: "strokeColor", scheme: "schemeSpectral"});
// enc.scale.domain = enc.scale.domain.sort((a,b) => b.localeCompare(a));

// let mean = scn.mark("line", {x1: 100, y1: 300, x2: 800, y2: 300, strokeWidth: 1, strokeColor: "#222"});
// let coll = msc.divide(mean, dt, {attribute: "Decade", layout: msc.layout("grid", {"numRows": 1, "colGap": 30})});
// msc.encode(coll.firstChild, {channel: "y", attribute: "CO2", aggregator: "mean", scale: yEnc.scale});
// //msc.affix(coll.firstChild, polyLine, "x");
// msc.encode(coll.firstChild.vertices[0], {channel: "x", attribute: "Scaled Date", aggregator: "min", scale: xEnc.scale});
// msc.encode(coll.firstChild.vertices[1], {channel: "x", attribute: "Scaled Date", aggregator: "max", scale: xEnc.scale});

// scn.axis("x", "Decade", {orientation: "bottom", pathVisible: false});
// scn.axis("y", "CO2", {orientation: "left", pathVisible: false});
// scn.gridlines("y", "CO2", {"strokeColor": "#eee"});
// scn.legend("strokeColor", "Decade", {x: 990, y: 100});