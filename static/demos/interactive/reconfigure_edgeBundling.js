let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/miserables.json");

let node = scene.mark("circle", {radius: 6, x: 100, y: 90}),
    link = scene.mark("bundledPath", {strength: 0});

let [nodes, links] = msc.repeat([node, link], data);
//msc.sortChildren(nodes, "group");
//scene.setLayout(nodes, msc.layout("circular", {x: 400, y: 350, radius: 200}));
let nodeTree = data.buildNodeHierarchy(["group"]);
scene.setLayout(nodes, msc.layout("cluster", {tree: nodeTree, radial: true, x: 400, y: 350, angleExtent: 360, radius: 200}));
msc.encode(node, {attribute: "group", channel: "fillColor"});
scene.axis("angle", "id", {tickVisible: false, pathVisible: false, titleVisible: false});

let inputTrigger = { event: "input", target: "my-slider" },
    responder = { component: link, properties: ["strength"] },
    callback = (condMet, ctx, compnt) => {
        compnt.strength = ctx.get("inputValue");
    }
let tg = msc.activate(inputTrigger, responder, undefined, callback);

let trigger = { event: "hover", target: node },
    nodeResponder = { component: node, channels: ["strokeColor", "strokeWidth"] },
    matchNode = (ctx, compnt) => compnt === ctx.get("element"),
    highlighter = (condMet, ctx, compnt) => {
        if (condMet) {
            compnt.strokeColor = 'black';
            compnt.strokeWidth = 2;
        }
    };
msc.activate(trigger, nodeResponder, matchNode, highlighter);

let linkResponder = { component: link, channels: ["opacity"] },
    respEval = (ctx, compnt) => !ctx.get("element") || compnt.source === ctx.get("element") || compnt.target === ctx.get("element"),
    linkHighlighter = (condMet, ctx, compnt) => {
        if (!condMet) {
            compnt.opacity = 0.02;
        }
    };
msc.activate(trigger, linkResponder, respEval, linkHighlighter);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scene);
