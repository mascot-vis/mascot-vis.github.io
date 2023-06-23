let scene = msc.scene();
let data = await msc.graphjson("datasets/graphjson/miserables.json");
data.nodeTable.transform("sort", ["group", "id"]);
let node = scene.mark("circle", {radius: 6, x: 100, y: 460}),
    link = scene.mark("link", {mode: "arcClockwise", opacity: 0.2, strokeColor: "black"});
let [nodes, links] = scene.repeat([node, link], data);
scene.encode(node, {field: "group", channel: "fillColor"});

nodes.layout = msc.layout("grid", {numRows: 1, colGap: 3});
scene.axis("x", "id", {labelRotation: -45, pathVisible: false, tickVisible: false, labelOffset: 0});