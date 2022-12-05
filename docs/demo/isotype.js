let scene = msc.scene();
let dt = await msc.csv("csv/waffle.csv");

let rect = scene.mark("image", {x:200, y: 100, width: 20, height: 40, src: "demo/img/human.png"});
let c = scene.repeat(rect, dt);
let bins = scene.classify(c.children, "Age Bin", c);
bins.forEach(d => d.layout = msc.layout("grid", {numCols: 15, rowGap: 5, hgap: 10}));
c.layout = msc.layout("stack", {orientation: "vertical", gap: 30});
scene.axis("y", "Age Bin", {orientation: "left", tickVisible: false, pathVisible: false});