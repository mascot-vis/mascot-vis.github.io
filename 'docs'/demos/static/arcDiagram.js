let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/miserables.json");
// console.log(data.nodeList, data.linkList);

//data.nodeTable.transform("sort", ["group", "id"]);
let node = scene.mark("circle", {radius: 6, x: 60, y: 450}),
    link = scene.mark("arc", {opacity: 0.2, strokeColor: "black", strokeWidth: 0.5, thickness: 1, direction: "clockwise"});
let [nodes, links] = scene.repeat([node, link], data);
scene.encode(node, {attribute: "group", channel: "fillColor"});
scene.setLayout(nodes, msc.layout("grid", {numRows: 1, colGap: 2}));
scene.sortChildren(nodes, "group");
scene.axis("x", "id", {labelRotation: -45, pathVisible: false, tickVisible: false, labelOffset: 0, titleVisible: false});