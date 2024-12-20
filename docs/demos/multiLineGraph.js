let scn = msc.scene();
let dt = await msc.csv("datasets/csv/stocks.csv");
//dt.parseFieldAsDate("date", "%b %Y");
let line = scn.mark("line", {x1: 200, y1: 100, x2: 800, y2: 400, strokeColor: "green"});

//TODO: test swapping the order of repeat and partition
let collection = scn.repeat(line, dt, {field: "company"});
let polyLine = scn.densify(line, dt, {field: "date"});

let vertex = polyLine.vertices[0];
scn.encode(vertex, {field: "date", channel: "x", rangeExtent: 600});
scn.encode(vertex, {field: "price", channel: "y"});
scn.encode(polyLine, {field: "company", channel: "strokeColor"});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scn.axis("y", "price", {orientation: "left"});
scn.legend("strokeColor", "company", {x: 850, y: 100});


// let r = msc.renderer("svg");
// r.render(scn, "svgElement", {collectionBounds: false});	