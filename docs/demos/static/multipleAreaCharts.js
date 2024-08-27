let scene = msc.scene();
let data = await msc.csv("/datasets/csv/wsj_red_blue_states.csv");
let rect = scene.mark("rect", {top:100, left: 100, width: 50, height: 50, strokeColor: "#fff", strokeWidth: 0, fillColor: "#ccc"});

scene.repeat(rect, data, {attribute: "State"});


let area = scene.densify(rect, data, {attribute: "Year", orientation: "horizontal"});
let xEnc = scene.encode(area, {attribute: "MapX", channel: "x", rangeExtent: 950});
let yEnc = scene.encode(area, {attribute: "MapY", channel: "y", rangeExtent: 550});

let xvEnc = scene.encode(area.topLeftVertex, {attribute: "Year", channel: "x"});
scene.encode(area.bottomLeftVertex, {attribute: "Year", channel: "x", shareScale: xvEnc});
scene.encode(area, {attribute: "PVI Score", channel: "height"});
scene.encode(area, {channel: "fillGradient", attribute: "PVI Score", mapping: {"45": "#B6293E", "0.005": "#B6293E", "0": "white", "-0.005": "#477EC0", "-45": "#477EC0"}});

let text = scene.mark("text", {x: 0, y:85});
scene.repeat(text, data, {attribute: "State"});
scene.encode(text, {channel: "text", attribute: "State"});
scene.affix(text, area, "x");
scene.encode(text, {channel: "y", attribute: "MapY", rangeExtent: 550});