let scn = msc.scene();
let data = await msc.csv("/datasets/csv/pieChartData.csv");

let ring = scn.mark("ring", {innerRadius: 70, outerRadius: 120, x: 280, y: 200, fillColor: "orange", strokeColor: "#888"});
let {newMark:arc, collection:arcs} = scn.divide(ring, data, {attribute: "category"});

scn.encode(arc, {attribute: "category", channel: "fillColor", scheme: "schemeSet3"});
scn.encode(arc, {attribute: "minutes", channel: "angle"});

scn.legend("fillColor", "category", {x: 450, y: 80});