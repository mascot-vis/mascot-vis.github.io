let scene = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/RC-VIS.json");

let node = scene.mark("circle", {radius: 6, x: 100, y: 90}),
    link = scene.mark("bundledPath", {strength: 0});

let [nodes, links] = msc.repeat([node, link], data);
//msc.sortChildren(nodes, "group");
//scene.setLayout(nodes, msc.layout("circular", {x: 400, y: 350, radius: 200}));
let nodeTree = data.buildNodeHierarchy(["group"]);
scene.setLayout(nodes, msc.layout("cluster", {tree: nodeTree, radial: true, x: 400, y: 350, angleExtent: 360, radius: 200}));
msc.encode(node, {attribute: "group", channel: "fillColor"});
scene.axis("angle", "id", {tickVisible: false, pathVisible: false, titleVisible: false});

const slider = document.createElement('input');
slider.type = 'range';
slider.min = '0'; // Minimum value
slider.max = '1'; // Maximum value
slider.value = '0'; // Default value
slider.step = '0.05';
slider.id = 'my-slider'; // Optional: Set an ID for the slider
slider.style.width = '200px';
slider.style.height = '8px';
slider.style.marginTop = "10px";

let span = document.createElement('span');
span.textContent = "Bundle Strength";
document.getElementById("ctrlPanel").appendChild(span);
document.getElementById("ctrlPanel").appendChild(slider);

let inputTrigger = { event:"input", type: "widget", element: "my-slider" },
    callback = () => {
        msc.update(link, {strength: slider.value})
    }
msc.activate(inputTrigger, {}, undefined, callback);

let trigger = { event: "hover", type: "element", element: node },
    nodeTarget = { target: node, targetChannels: ["strokeColor", "strokeWidth"] },
    matchNode = (trigger, target) => target === trigger,
    highlighter = (condMet, trigger, target) => {
        if (condMet) {
            msc.update(target, { strokeColor: 'black', strokeWidth: 2 }, true);
        }
    };
msc.activate(trigger, nodeTarget, matchNode, highlighter);

let linkTarget = { target: link, targetChannels: ["opacity"] },
    targetEval = (trigger, target) => !trigger || target.source === trigger || target.target === trigger,
    linkHighlighter = (condMet, trigger, target, evtCoords) => {
        if (!condMet) {
            msc.update(target, { opacity: '0.02' }, true);
        }
    };
msc.activate(trigger, linkTarget, targetEval, linkHighlighter);