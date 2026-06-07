let scene = msc.scene();
let graph = await msc.graphJSON("/datasets/graphjson/celeste_port_connections.json");
// let node = scene.mark("circle", {radius: 6, x: 100, y: 90, fillColor: "white", strokeColor: "#00CCFF"}),
let link = scene.mark("chord", {fillColor: "orange", opacity: 0.25, strokeColor: "#aaa"});
let links = msc.repeat(link, graph.linkTable);
// let [nodes, links] = msc.repeat([node, link], graph);
//scene.setLayout(nodes, msc.layout("cluster", {tree: tree, radial: true, x: 400, y: 350, angleExtent: 360, radius: 200}));

let tree = await msc.treeJSON("/datasets/treejson/celeste/celeste_netwk_hierarchy.json");
let c = scene.mark("ring", {x: 400, y: 350, innerRadius: 300, outerRadius: 301, fillColor: "white", strokeColor: "#ddd"});
let coll = msc.stratify(c, tree, {size: 22, direction: "inward" });
msc.encode(coll.firstChild, {attribute: "numPorts", channel: "angle"});

// console.log(coll.children.map(d => d.dataScope.getAttrVal("type")))
msc.encode(coll.firstChild, {channel: "fillColor", attribute: "type", mapping: {"Node": "#00CCFF", "Virtualization": "#66E0FF", "Application": "#CCF5FF", "Port": "white"}});
scene.legend("fillColor", "type", { x: 700, y: 100 });

msc.connect(coll.children, links.children);
let text = scene.mark("text", {fillColor: "#003366", fontSize: "10.5px"});
msc.repeat(text, tree.nodeTable);
msc.encode(text, {channel: "text", attribute: "name"});
msc.affix(text, coll.firstChild, "radialDistance", {elementAnchor: "top", baseAnchor: "top", offset: -3, attribute: "id"});
//msc.affix(text, coll.firstChild, "angle", {attribute: "id"});


let trigger = { event: "hover", type: "element", element: coll.firstChild },
    target = { target: coll.firstChild, targetChannels: ["fillColor"] },
    match = (trigger, target) => target === trigger,
    highlighter = (condMet, trigger, target) => {
        if (condMet) {
            msc.update(target, {
                fillColor: '#FFFFCC'
            }, true);
        }
    };
msc.activate(trigger, target, match, highlighter);

let tooltip = scene.mark("richText", { x:100, y: 100, width: 100, text: "", fontWeight: "bold", visibility: "hidden", anchor: ["left", "top"] });

let tooltipTarget = { target: tooltip, targetChannels: ["visibility", "x", "y", "text"] },
    triggerElemExists = (trigger, target) => trigger !== undefined,
    tooltipEffect = function (condMet, trigger, target, mouseEvent) {
        if (condMet) {
            let ds = trigger.dataScope;
            msc.update(target, {
                visibility: "visible",
                x: mouseEvent.x + 12,
                y: mouseEvent.y + 12,
                text: trigger.type === "arc" ? ds.getAttrVal('name') : ds.getAttrVal('port')
            }, true);
        }
    };
msc.activate(trigger, tooltipTarget, triggerElemExists, tooltipEffect);

let trigger2 = { event: "hover", type: "element", element: links.firstChild },
    target2 = { target: links.firstChild, targetChannels: ["strokeColor"] };

//msc.activate(trigger2, tooltipTarget, triggerElemExists, tooltipEffect);
