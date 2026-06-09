let scn = msc.scene();
let line = scn.mark("line", { x1: 200, y1: 80, x2: 400, y2: 80, strokeColor: "green" });

let dt = await msc.csv("/datasets/csv/obesityEducation.csv");

msc.repeat(line, dt, { attribute: "State" });
let enc = msc.encode(line.vertices[0], { attribute: "Obesity Percentage", channel: "y" });
msc.encode(line.vertices[1], { attribute: "BA Degree Percentage", channel: "y", shareScale: enc });
//enc.domain = [15, 50];
enc.rangeExtent = 500;

msc.update(line.vertices[0], { shape: "circle", radius: 4, opacity: "0.7" });
msc.update(line.vertices[1], { shape: "circle", radius: 4, opacity: "0.7" });
msc.encode(line, { attribute: "Obesity vs Higher Education", channel: "strokeColor" });

scn.axis("y", "Obesity Percentage", { orientation: "left" });
scn.axis("y", "BA Degree Percentage", { orientation: "right" });
scn.legend("strokeColor", "Obesity vs Higher Education", { x: 460, y: 100 });
