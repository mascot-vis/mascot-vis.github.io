let scn = msc.scene();
let data = await msc.csv("/datasets/csv/pieChartData.csv");

let circ = scn.mark("circle", {radius: 120, x: 300, y: 200, fillColor: "orange", strokeColor: "#888"});
let {newMark:pie, collection:pies} = msc.divide(circ, data, {attribute: "category"});

msc.encode(pie, "fillColor", "category", {scheme: "schemePaired"});
msc.encode(pie, "angle", "minutes");

scn.legend("fillColor", "category", {x: 450, y: 80});