let scene = msc.scene();
let dt = await msc.csv("datasets/csv/gdp-lifeExp.csv");
let rect = scene.mark("rect", {left:200, top: 300, width: 10, height: 10, strokeWidth: 0, fillColor: "#ccc"});
let c = scene.repeat(rect, dt);
scene.classify(c, {field: "Continent", layout: msc.layout("grid", {numCols: 6, rowGap: 2, colGap: 2, dir: ["l2r", "b2t"]})});
c.layout = msc.layout("grid", {numRows: 1, colGap: 30});
scene.encode(rect, {channel: "fillColor", field: "Life expectancy group", mapping: {"below60": "#EEBC41", "above60": "#ABC88D"}});
scene.axis("x", "Continent", {orientation: "bottom", tickVisible: false, pathVisible: false});
scene.legend("fillColor", "Life expectancy group", {"x": 800, "y": 200});

