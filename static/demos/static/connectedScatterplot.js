let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/drivingShifts.csv");

let line = scn.mark("line", {x1: 100, y1: 100, x2: 600, y2:500, strokeWidth: 2.5, strokeColor: "black", vxShape: "circle", vxRadius: 3.5, vxFillColor: "white", vxStrokeColor: "black", vxStrokeWidth: 1});
let polyline = msc.densify(line, dt);
polyline.curveMode = "natural";
//msc.update(polyline.firstVertex, {shape: "circle", radius: 3.5, strokeColor: "black", strokeWidth: 1, fillColor: "white"});

msc.encode(polyline.firstVertex, {attribute: "miles", channel: "x"});
msc.encode(polyline.firstVertex, {attribute: "gas", channel: "y"});

scn.axis("x", "miles", {orientation: "top", pathVisible: false});
scn.axis("y", "gas", {orientation: "left", pathVisible: false});
scn.gridlines("x", "miles");
scn.gridlines("y", "gas");