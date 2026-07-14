let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/stocks.csv");
//dt.parseDate("date", "%b %Y");
let line = scn.mark("line", {x1: 200, y1: 100, x2: 400, y2: 400, strokeColor: "green"});

//TODO: test swapping the order of repeat and partition
let collection = msc.repeat(line, dt, {attribute: "company"});
// let collection = msc.repeat(line, dt, {attribute: "company"});
let polyLine = msc.densify(line, dt, {attribute: "date"});

let vertex = polyLine.vertices[0];
let enc = msc.encode(vertex, "x", "date", {rangeExtent: 600});
msc.encode(vertex, "y", "price");
msc.encode(polyLine, "strokeColor", "company");

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scn.axis("y", "price", {orientation: "left"});
scn.legend("strokeColor", "company", {x: 900, y: 100});