let scn = msc.scene();
let data = await msc.csv("/datasets/csv/pieChartData.csv");

let ring = scn.mark("ring", {innerRadius: 70, outerRadius: 120, x: 280, y: 200, fillColor: "orange", strokeColor: "#888"});
let {newMark:arc, collection:arcs} = msc.divide(ring, data, {attribute: "category"});

msc.encode(arc, "fillColor", "category", {scheme: "schemeSet3"});
msc.encode(arc, "angle", "minutes");

scn.legend("fillColor", "category", {x: 450, y: 80});