let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/modelComparison.csv");
let circle = scn.mark("circle", {radius: 160, x: 300, y: 320, fillColor: "none", strokeWidth: 3.5, strokeColor: "blue", vxShape: "circle", vxRadius: 6, vxFillColor: "crimson", vxOpacity: 0.5});
let coll = msc.repeat(circle, dt, {attribute: "Model"}),
    coll2 = msc.repeat(coll, dt, {attribute: "Task", layout: msc.layout("grid", {numRows: 1, colGap: 170})});
let polygon = msc.densify(circle, dt, {attribute: "Category"});
msc.encode(polygon.firstVertex, "radialDistance", "Score", {domain: [0, 5]});
msc.encode(polygon, "strokeColor", "Model");

for (let i = 90; i < 450; i+= 36)
    scn.axis("radialDistance", "Score", {rotation: i, labelVisible: (i - 90)%72 === 0, labelFormat: ".2s", strokeColor: "#aaa", textColor: "#aaa", titleVisible: false, tickValues: [1.0, 2.0, 3.0, 4.0, 5.0]});

for (let i = 90; i < 450; i+= 36)
    scn.axis("radialDistance", "Score", {element: coll2.children[1].children[0].firstVertex, labelVisible: (i - 90)%72 === 0, rotation: i, labelFormat: ".2s", strokeColor: "#aaa", textColor: "#aaa", titleVisible: false, tickValues: [1.0, 2.0, 3.0, 4.0, 5.0]});

scn.axis("angle", "Category");
scn.axis("x", "Task", {showTitle: false, titleVisible: false, tickVisible: false, pathVisible: false, orientation: "top", labelOffset: 50});


scn.gridlines("radialDistance", "Score", {strokeColor: "#aaa", values: [1.0, 2.0, 3.0, 4.0, 5.0]});
scn.gridlines("radialDistance", "Score", {element: coll2.children[1].children[0].firstVertex, strokeColor: "#aaa", values: [1.0, 2.0, 3.0, 4.0, 5.0]});

scn.legend("strokeColor", "Model", {x: 520, y: 100})