let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/co2-concentrations.csv");
let line = scn.mark("line", {x1: 200, y1: 100, x2: 800, y2: 600, strokeWidth: 3});

let collection = msc.repeat(line, dt, {attribute: "Decade"});
let polyLine = msc.densify(line, dt, {attribute: "Date"});

let vertex = polyLine.vertices[0];
msc.encode(vertex, {attribute: "Scaled Date", channel: "x"});
msc.encode(vertex, {attribute: "CO2", channel: "y"});
let enc = msc.encode(polyLine, {attribute: "Decade", channel: "strokeColor", scheme: "schemeSpectral"});
enc.domain = enc.getScale(polyLine).domain.sort((a,b) => b.localeCompare(a));
scn.axis("x", "Scaled Date", {orientation: "bottom", pathVisible: false});
scn.axis("y", "CO2", {orientation: "left", pathVisible: false});
scn.gridlines("x", "Scaled Date", {"strokeColor": "#eee"});
scn.gridlines("y", "CO2", {"strokeColor": "#eee"});
scn.legend("strokeColor", "Decade", {x: 840, y: 100});