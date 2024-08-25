let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/stocks.csv");
//dt.parseAttributeAsDate("date", "%b %Y");
let line = scn.mark("line", {x1: 200, y1: 100, x2: 400, y2: 300, strokeColor: "green"});

//TODO: test swapping the order of repeat and partition
let collection = scn.repeat(line, dt, {attribute: "company", layout: msc.layout("grid", {"numCols": 2, "colGap": 50, "rowGap": 50})});
// let collection = scn.repeat(line, dt, {attribute: "company"});
let polyLine = scn.densify(line, dt, {attribute: "date"});

let vertex = polyLine.vertices[0];
let enc = scn.encode(vertex, {attribute: "date", channel: "x", rangeExtent: 300});
scn.encode(vertex, {attribute: "price", channel: "y"});
scn.encode(polyLine, {attribute: "company", channel: "strokeColor"});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y", titleVisible: false});
scn.axis("y", "price", {orientation: "left", titleVisible: false});
scn.legend("strokeColor", "company", {x: 900, y: 100});