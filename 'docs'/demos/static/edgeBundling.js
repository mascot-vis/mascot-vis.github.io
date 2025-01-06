let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/miserables.json");

let node = scene.mark("circle", {radius: 6, x: 100, y: 90}),
    link = scene.mark("bundledPath", {strength: 0.9});

let [nodes, links] = scene.repeat([node, link], data);
//scene.sortChildren(nodes, "group");
//scene.setLayout(nodes, msc.layout("circular", {x: 400, y: 350, radius: 200}));
let nodeTree = data.buildNodeHierarchy(["group"]);
scene.setLayout(nodes, msc.layout("cluster", {tree: nodeTree, x: 400, y: 350, radial: true, angleExtent: 360, radius: 200}));
scene.encode(node, {attribute: "group", channel: "fillColor"});
scene.axis("angle", "id", {tickVisible: false, pathVisible: false, titleVisible: false});
