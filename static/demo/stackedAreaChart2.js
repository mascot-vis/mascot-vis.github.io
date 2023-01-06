let scn = msc.scene();
let dt = await msc.csv("csv/mobileOS.csv");
let rect = scn.mark("rect", {top:100, left: 100, width: 500, height: 400, fillColor: "#fff", strokeWidth: 0} );

let os = scn.divide(rect, dt, {orientation: "vertical", field: "Mobile Operating System"});
let area = scn.densify(os.firstChild, dt, {field: "Date", orientation: "horizontal"});
scn.encode(area.firstVertexPair, {channel: "x", field: "Date", rangeExtent: 700});
scn.encode(area, {field: "Percent of Usage", channel: "height", rangeExtent: 250});
scn.encode(area, {field: "Mobile Operating System", channel: "fillColor"});
scn.axis("height", "Percent of Usage", {orientation: "left"});
scn.axis("x", "Date", {orientation: "bottom"});
scn.legend("fillColor", "Mobile Operating System", {x: 900, y: 100});