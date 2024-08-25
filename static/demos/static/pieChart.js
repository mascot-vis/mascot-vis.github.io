let scn = msc.scene();
let data = await msc.csv("/datasets/csv/pieChartData.csv");

let circ = scn.mark("circle", {radius: 120, x: 300, y: 200, fillColor: "orange", strokeColor: "#888"});
let {newMark:pie, collection:pies} = scn.divide(circ, data, {attribute: "category"});

scn.encode(pie, {attribute: "category", channel: "fillColor", scheme: "schemePaired"});
scn.encode(pie, {attribute: "minutes", channel: "angle"});

scn.legend("fillColor", "category", {x: 450, y: 80});