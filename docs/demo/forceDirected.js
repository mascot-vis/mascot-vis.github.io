let scene = atlas.scene();
let data = await atlas.graphjson("graphjson/miserables.json");

let node = scene.mark("circle", {radius: 6}),
    link = scene.mark("link");
let [nodes, links] = scene.repeat([node, link], data);

//let nodes = scene.repeat(node, data.nodeTable);
nodes.layout = atlas.layout("force", {x: 400, y: 300, iterations: 300});
scene.encode(node, {field: "group", channel: "fillColor"});