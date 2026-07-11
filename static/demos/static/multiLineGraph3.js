let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/industryEarningsJobs.csv");
let line = scn.mark("line", {x1: 200, y1: 100, x2: 800, y2: 600, strokeWidth: 3});

let collection = msc.repeat(line, dt, {attribute: "Industry"});
let polyLine = msc.densify(line, dt, {attribute: "Date"});

let vertex = polyLine.vertices[0];
msc.encode(vertex, "x", "Date");
msc.encode(vertex, "y", "Employees (Thousands)");
let enc = msc.encode(polyLine, "strokeColor", "Industry", {scheme: "schemeSpectral"});

scn.axis("x", "Date", {orientation: "bottom", pathVisible: false});
scn.axis("y", "Employees (Thousands)", {orientation: "left", pathVisible: false});
scn.gridlines("x", "Date", {"strokeColor": "#eee"});
scn.gridlines("y", "Employees (Thousands)", {"strokeColor": "#eee"});
scn.legend("strokeColor", "Industry", {x: 840, y: 100});