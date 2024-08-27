let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/miserables.json");

let node = scene.mark("circle", {radius: 6, x: 100, y: 90}),
    link = scene.mark("line");

let [nodes, links] = scene.repeat([node, link], data);
scene.classify(nodes, {attribute: "group", layout: msc.layout("grid", {numRows: 1})});
scene.setLayout(nodes, msc.layout("grid", {"numCols": 2, "rowGap": 40, "colGap": 50}));
scene.encode(node, {attribute: "group", channel: "fillColor"});
