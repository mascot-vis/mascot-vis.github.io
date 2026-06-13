let scene = msc.scene();
let graph = await msc.graphJSON("/datasets/graphjson/celeste_node_connections.json");
let node = scene.mark("circle", {radius: 28, fillColor: "#00CCFF"}),
    link = scene.mark("line", {strokeWidth: 6});
let [nodes, links] = msc.repeat([node, link], graph);
//msc.encode(node, {channel: "area", attribute: "numPorts", rangeExtent: 640})
scene.setLayout(nodes, msc.layout("force", {x: 450, y: 350, repulsion: 2000, linkDistance: 120, iterations: 80}));
let trees = [];
for (let n of nodes.children) {
    let id = n.dataScope.getAttrVal("id");
    let tree = await msc.treeJSON("/datasets/treejson/celeste/node_hierarchy/celeste_" + id + "_hierarchy.json");
    trees.push(tree);
}
let coll = msc.stratify(node, trees, {size: 20});
msc.encode(coll.firstChild, {channel: "fillColor", attribute: "type", mapping: {"Node": "#00CCFF", "Virtualization": "#66E0FF", "Application": "#CCF5FF", "Port": "white"}});

let graph2 = await msc.graphJSON("/datasets/graphjson/celeste_netwk_all.json");
let text = scene.mark("text", {fillColor: "#003366", fontSize: "11px"});
msc.repeat(text, graph2.nodeTable);
msc.encode(text, {channel: "text", attribute: "name"});
msc.affix(text, coll.firstChild, "radialDistance", {attribute: "id"});

let text1 = scene.mark("text", {fillColor: "#003366", fontSize: "10.5px", fontWeight: "bold"});
msc.repeat(text1, graph.nodeTable);
msc.encode(text1, {channel: "text", attribute: "name"});
msc.affix(text1, node, "x", {elementAnchor: "center", baseAnchor: "center", offset: 0, attribute: "id"});
msc.affix(text1, node, "y", {elementAnchor: "middle", baseAnchor: "middle", offset: 0, attribute: "id"});

scene.legend("fillColor", "type", { x: 800, y: 150 });

