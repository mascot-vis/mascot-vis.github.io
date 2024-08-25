let scn = msc.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 700, y2: 500, strokeColor: "#008BBE", strokeWidth: 3, vxShape: "circle", vxRadius: 5, vxFillColor: "#008BBE"});
let dt = await msc.csv("/datasets/csv/covidCases.csv");
scn.repeat(line, dt, {attribute: "Model"});
let polyline = scn.densify(line, dt, {attribute: "Date"});
scn.setProperties(polyline, {curveMode: "natural"});
scn.encode(polyline.firstVertex, {attribute: "Date", channel: "x"});
scn.encode(polyline.firstVertex, {attribute: "New Cases", channel: "y", includeZero: true});
scn.encode(polyline, {attribute: "Model", channel: "strokeColor"});

let predicted = scn.findElements([{attribute: "Type", value: "Predicted"}]);
predicted.forEach(d => {d.strokeDash = "10 6"; d.opacity = 0.7;});

scn.axis("x", "Date", {orientation: "bottom", labelFormat: "%m/%d/%Y"});
scn.axis("y", "New Cases", {orientation: "left", labelFormat: ".2s", titleOffset: 45});
scn.gridlines("y", "New Cases");
scn.legend("strokeColor", "Model", {x: 720, y: 200});