let scn = msc.scene();
let circle = scn.mark("circle", {radius: 240, x: 400, y: 320, fillColor: "#C2E4F9", strokeWidth: 1.5, strokeColor: "blue", opacity:0.25, vxShape: "circle", vxRadius: 6, vxFillColor: "crimson", vxOpacity: 0.5});
let dt = await msc.csv("/datasets/csv/monthlySales.csv");

let polygon = scn.densify(circle, dt, {attribute: "Month"});
scn.encode(polygon.firstVertex, {attribute: "Sales", channel: "radialDistance"});

for (let i = 0; i < 360; i+= 30)
    scn.axis("radialDistance", "Sales", {rotation: i, labelFormat: ".2s", strokeColor: "#bbb", textColor: "#bbb", titleVisible: false, tickValues:[10000, 20000, 30000, 40000]});
scn.gridlines("radialDistance", "Sales", {values: [10000, 20000, 30000, 40000]});