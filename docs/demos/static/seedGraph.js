let scene = msc.scene();
let data = await msc.graphjson("datasets/graphjson/seed_graph.json");
let graphs = data.transform("partition");
let x = 140, y = 100, timeScale, covScale, mutScale, growScale;
graphs.sort((a, b) => a.isLinear() - b.isLinear() );
for (let g of graphs) {
    let node = scene.mark("circle", {x: 20, y: 120, radius: 4, fillColor: "#888", strokeWidth: 1, strokeColor: "#555"}),
        link = scene.mark("link", {sourceAnchor: ["center", "middle"], targetAnchor: ["center", "middle"], strokeColor: "#bbb", mode: "curveVertical"});
    let [nodes, links] = scene.repeat([node, link], g);

    if (g.isLinear()) {
        nodes.children.forEach(n => n.x = x);
        x = nodes.bounds.right + 10;
    } else {
        nodes.layout = msc.layout("force", {x: x, y: y, iterations: 300, repulsion: 120, linkDistance: 10});
        nodes.children.forEach(n => n.x += nodes.bounds.width/2);
        x = nodes.bounds.right + nodes.bounds.width/2 + 10;
    }
    covScale = scene.encode(node, {channel: "fillColor", field: "new_cov",mapping: {true: "#ccc", false: "#777"}, scale: covScale}).scale;
    //covScale = scene.encode(node, {channel: "fillColor", field: "branch_growth", scheme: "interpolateGreys", scale: covScale}).scale;
    mutScale = scene.encode(link, {channel: "strokeColor", field: "mutation", scale: mutScale}).scale;
    timeScale = scene.encode(node, {field: "time", channel: "y", scale: timeScale, flipScale: true}).scale;
    //growScale = scene.encode(node, {field: "branch_growth", channel: "radius", scale: growScale, range: [1, 6]}).scale;
    scene.encode(link, {channel: "source", field: "source"});
    scene.encode(link, {channel: "target", field: "target"});
}
timeScale.rangeExtent = 500;
scene.axis("y", "time", {'labelFormat': '.2s', orientation: "left"});
scene.legend("strokeColor", "mutation", {x: 200, y: 450});