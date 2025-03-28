let scn = msc.scene();
let line = scn.mark("line", { x1: 200, y1: 80, x2: 400, y2: 80, strokeColor: "green" });

let dt = await msc.csv("/datasets/csv/obesityEducation.csv");

scn.repeat(line, dt, { attribute: "State" });
let enc = scn.encode(line.vertices[0], { attribute: "Obesity Percentage", channel: "y" });
scn.encode(line.vertices[1], { attribute: "BA Degree Percentage", channel: "y", shareScale: enc });
//enc.domain = [15, 50];
enc.rangeExtent = 500;

scn.setProperties(line.vertices[0], { shape: "circle", radius: 4, opacity: "0.7" });
scn.setProperties(line.vertices[1], { shape: "circle", radius: 4, opacity: "0.7" });
scn.encode(line, { attribute: "Obesity vs Higher Education", channel: "strokeColor" });

let leftAxis = scn.axis("y", "Obesity Percentage", { orientation: "left" });
let rightAxis = scn.axis("y", "BA Degree Percentage", { orientation: "right" });
scn.legend("strokeColor", "Obesity vs Higher Education", { x: 460, y: 100 });


let dt2 = await msc.csv("'docs'/datasets/csv/alzimersVsHealthy.csv");
scn.repopulate(line, dt2, {"State":"LocationDesc"});