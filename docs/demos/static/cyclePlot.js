let scn = msc.scene();
let dt = await msc.csv("datasets/csv/co2-concentrations.csv");
let line1 = scn.mark("line", {x1: 100, y1: 200, x2: 180, y2: 600, strokeWidth: 3}),
    line2 = scn.mark("line", {x1: 100, y1: 250, x2: 180, y2: 250, strokeWidth: 3});

let glyph = scn.glyph(line1, line2);
let coll = scn.repeat(glyph, dt, {field: "Decade", layout: msc.layout("grid", {"numRows": 1, "colGap": 30})});

let polyLine = scn.densify(line1, dt, {field: "Date"});
let vertex = polyLine.vertices[0];
let xEnc = scn.encode(vertex, {field: "Scaled Date", channel: "x"});
let yEnc = scn.encode(vertex, {field: "CO2", channel: "y"});

scn.encode(line2, {channel: "y", field: "CO2", scale: yEnc.scale, aggregator: "mean"});
scn.encode(line2.vertices[0], {channel: "x", field: "Scaled Date", aggregator: "min", scale: xEnc.scale});
scn.encode(line2.vertices[1], {channel: "x", field: "Scaled Date", aggregator: "max", scale: xEnc.scale});

let enc = scn.encode(polyLine, {field: "Decade", channel: "strokeColor", scheme: "schemeSpectral"});
enc.scale.domain = enc.scale.domain.sort((a,b) => b.localeCompare(a));

scn.axis("x", "Decade", {orientation: "bottom", pathVisible: false});
scn.axis("y", "CO2", {orientation: "left", pathVisible: false});
scn.gridlines("y", "CO2", {"strokeColor": "#eee"});
scn.legend("strokeColor", "Decade", {x: 990, y: 100});

// let line = scn.mark("line", {x1: 100, y1: 200, x2: 580, y2: 600, strokeWidth: 3});
// let collection = scn.divide(line, dt, {field: "Decade", layout: msc.layout("grid", {"numRows": 1, "colGap": 30})});
// let polyLine = scn.densify(collection.firstChild, dt, {field: "Date"});

// let vertex = polyLine.vertices[0];
// let xEnc = scn.encode(vertex, {field: "Scaled Date", channel: "x"});
// let yEnc = scn.encode(vertex, {field: "CO2", channel: "y"});
// yEnc.scale.rangeExtent = 400;
// let enc = scn.encode(polyLine, {field: "Decade", channel: "strokeColor", scheme: "schemeSpectral"});
// enc.scale.domain = enc.scale.domain.sort((a,b) => b.localeCompare(a));

// let mean = scn.mark("line", {x1: 100, y1: 300, x2: 800, y2: 300, strokeWidth: 1, strokeColor: "#222"});
// let coll = scn.divide(mean, dt, {field: "Decade", layout: msc.layout("grid", {"numRows": 1, "colGap": 30})});
// scn.encode(coll.firstChild, {channel: "y", field: "CO2", aggregator: "mean", scale: yEnc.scale});
// //scn.affix(coll.firstChild, polyLine, "x");
// scn.encode(coll.firstChild.vertices[0], {channel: "x", field: "Scaled Date", aggregator: "min", scale: xEnc.scale});
// scn.encode(coll.firstChild.vertices[1], {channel: "x", field: "Scaled Date", aggregator: "max", scale: xEnc.scale});

// scn.axis("x", "Decade", {orientation: "bottom", pathVisible: false});
// scn.axis("y", "CO2", {orientation: "left", pathVisible: false});
// scn.gridlines("y", "CO2", {"strokeColor": "#eee"});
// scn.legend("strokeColor", "Decade", {x: 990, y: 100});