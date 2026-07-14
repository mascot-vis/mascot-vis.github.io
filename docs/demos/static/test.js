
// let scene = msc.scene();
// let dt = await msc.csv("/datasets/csv/gdp-lifeExp.csv");
// let rect = scene.mark("rect", {left:200, top: 100, width: 100, height: 100, strokeWidth: 1, strokeColor: "white", fillColor: "#ccc", opacity: 0.5});
// let coll = msc.repeat(rect, dt, {attribute: "Continent", layout: msc.layout("grid")});
//msc.update(coll.layout, {"numCols": 1});

// let coll = msc.divide(rect, dt, {attribute: "Continent", orientation: "horizontal"});
// scene.axis("x", "Continent", {orientation: "bottom", tickVisible: false, pathVisible: false});
// msc.update(coll.layout, {"orientation": "vertical"});
// let rect = scene.mark("rect", {left:200, top: 300, width: 10, height: 10, strokeWidth: 0, fillColor: "#ccc"});
// let c = msc.repeat(rect, dt);
// // scene.classify(c, {attribute: "Continent", layout: msc.layout("grid", {numCols: 6, rowGap: 2, colGap: 2, dir: ["l2r", "b2t"]})});
// // c.layout = msc.layout("grid", {numRows: 1, colGap: 30});
// scene.classify(c, {attribute: "Continent", layout: msc.layout("grid", {numRows: 1, rowGap: 2, colGap: 2, dir: ["l2r", "b2t"]})});
// c.layout = msc.layout("grid", {numCols: 1, colGap: 30});
// msc.encode(rect, {channel: "fillColor", attribute: "Life expectancy group", mapping: {"below60": "#EEBC41", "above60": "#ABC88D"}});
// // scene.axis("x", "Continent", {orientation: "bottom", tickVisible: false, pathVisible: false});
// scene.axis("y", "Continent", {orientation: "left", tickVisible: false, pathVisible: false});
// scene.legend("fillColor", "Life expectancy group", {"x": 800, "y": 200});
// msc.update(c.firstChild, {layout: msc.layout("grid", {numCols: 6, rowGap: 2, colGap: 2, dir: ["l2r", "b2t"]})});
// msc.update(c, {layout: msc.layout("grid", {numRows: 1, colGap: 30})});