let scene = msc.scene();
let graph = await msc.graphJSON("/datasets/graphjson/miserables.json");
let tree = graph.buildNodeHierarchy(["group"]);

let node = scene.mark("circle", {radius: 6, x: 100, y: 90, fillColor: "gray"}),
    link = scene.mark("bezierCurve");

let [nodes, links] = scene.repeat([node, link], tree);
scene.setLayout(nodes, msc.layout("cluster", {x: 400, y: 350, radial: true, angleExtent: 360, radius: 200}));
scene.axis("angle", "id", {tickVisible: false, pathVisible: false, titleVisible: false});