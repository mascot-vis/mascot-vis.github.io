let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/miserables.json");

let node = scene.mark("circle", {radius: 6}),
    link = scene.mark("line");
let [nodes, links] = scene.repeat([node, link], data);

scene.setLayout(nodes, msc.layout("force", {x: 400, y: 300, repulsion: 80, iterations: 50}));
//nodes.layout = msc.layout("force", {x: 400, y: 300, iterations: 300});
scene.encode(node, {attribute: "group", channel: "fillColor"});