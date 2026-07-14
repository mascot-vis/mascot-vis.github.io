let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/mobileOS.csv");
let rect = scn.mark("rect", {top:100, left: 100, width: 500, height: 400, fillColor: "#fff", strokeWidth: 0} );

let os = msc.divide(rect, dt, {orientation: "vertical", attribute: "Mobile Operating System"});
let area = msc.densify(os.firstChild, dt, {attribute: "Date", orientation: "horizontal"});
msc.encode(area.firstVertexPair, "x", "Date", {rangeExtent: 700});
msc.encode(area, "height", "Percent of Usage", {rangeExtent: 250});
msc.encode(area, "fillColor", "Mobile Operating System");
scn.axis("height", "Percent of Usage", {orientation: "left"});
scn.axis("x", "Date", {orientation: "bottom"});
scn.legend("fillColor", "Mobile Operating System", {x: 900, y: 100});