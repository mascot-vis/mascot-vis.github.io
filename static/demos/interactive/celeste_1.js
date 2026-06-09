let scene = msc.scene();
let graph = await msc.graphJSON("/datasets/graphjson/celeste_netwk_all.json");
let node = scene.mark("circle", {radius: 6}),
    link = scene.mark("line");
let [nodes, links] = msc.repeat([node, link], graph);
scene.setLayout(nodes, msc.layout("force", {x: 400, y: 300, repulsion: 260, iterations: 150}));
//nodes.layout = msc.layout("directedGraph", {top: 100, left: 100, edgeSep: 10, direction: "TB"});

msc.encode(node, {attribute: "type", channel: "fillColor", mapping: {"Node": "#00CCFF", "Virtualization": "#66E0FF", "Application": "#CCF5FF", "Port": "white"}});
// let node = scene.mark("circle", {radius: 6, x: 100, y: 90, fillColor: "white", strokeColor: "#00CCFF"}),
//     link = scene.mark("bundledPath", {strength: 1, strokeWidth: 2});
// let [nodes, links] = msc.repeat([node, link], graph);
// let tree = await msc.treeJSON("/datasets/treejson/celeste_netwk_segment.json");
// scene.setLayout(nodes, msc.layout("cluster", {tree: tree, radial: true, x: 400, y: 350, angleExtent: 360, radius: 200}));

// // let c = scn.mark("circle", {x: 400, y: 350, radius: 250, fillColor: "#eee", strokeColor: "white"});
// let coll = scene.stratify(node, tree, {size: 30, startFromLeaf: true });
// // console.log(coll.children.map(d => d.dataScope.getAttrVal("type")))
// msc.encode(coll.firstChild, {channel: "fillColor", attribute: "type", mapping: {"Node": "#00CCFF", "Virtualization": "#66E0FF", "Application": "#CCF5FF", "Port": "white"}});
scene.legend("fillColor", "type", { x: 700, y: 150 });

// let text = scene.mark("text", {fillColor: "#003366", fontWeight: "bold", fontSize: "12px"});
// msc.repeat(text, tree.nodeTable);
// msc.encode(text, {channel: "text", attribute: "name"});
// msc.affix(text, coll.firstChild, "radialDistance", {elementAnchor: "top", baseAnchor: "top", offset: -10, attribute: "id"});
// msc.affix(text, coll.firstChild, "angle", {attribute: "id"});


// let trigger = { event: "hover", type: "element", element: node },
//     target = { target: node, targetChannels: ["fillColor"] },
//     match = (trigger, target) => target === trigger,
//     highlighter = (condMet, trigger, target) => {
//         if (condMet) {
//             msc.update(target, {
//                 fillColor: '#FFFFCC'
//             }, true);
//         }
//     };
// msc.activate(trigger, target, match, highlighter);

// let tooltip = scene.mark("text", { x: 100, y: 100, text: "", visibility: "hidden", anchor: ["left", "top"], backgroundColor: "#fff" });
// let tooltipTarget = { target: tooltip, targetChannels: ["visibility", "x", "y", "text"] },
//     triggerElemExists = (trigger, target) => trigger !== undefined,
//     tooltipEffect = function (condMet, trigger, target, mouseEvent) {
//         if (condMet) {
//             let ds = trigger.dataScope;
//             msc.update(target, {
//                 visibility: "visible",
//                 x: mouseEvent.x + 12,
//                 y: mouseEvent.y + 12,
//                 text: ds.getAttrVal('id')
//             }, true);
//         }
//     };
// msc.activate(trigger, tooltipTarget, triggerElemExists, tooltipEffect);