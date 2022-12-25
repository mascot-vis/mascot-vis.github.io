let scene = msc.scene();
let data = await msc.csv("csv/wsj_red_blue_states.csv");
let rect = scene.mark("rect", {top:100, left: 100, width: 50, height: 50, strokeColor: "#fff", strokeWidth: 0, fillColor: "#ccc"});

scene.repeat(rect, data, {field: "State"});
let xEnc = scene.encode(rect, {field: "MapX", channel: "x", rangeExtent: 950});
let yEnc = scene.encode(rect, {field: "MapY", channel: "y", rangeExtent: 550});

let area = scene.densify(rect, data, {field: "Year", orientation: "horizontal"});
scene.encode(area.firstVertexPair, {field: "Year", channel: "x"});
scene.encode(area, {field: "PVI Score", channel: "height"});
scene.encode(area, {channel: "fillGradient", field: "PVI Score", mapping: {"45": "#B6293E", "0.005": "#B6293E", "0": "white", "-0.005": "#477EC0", "-45": "#477EC0"}});

let text = scene.mark("text", {x: 0, y:90});
scene.repeat(text, data, {field: "State"});
scene.encode(text, {channel: "text", field: "State"});
scene.affix(text, area, "x");
scene.encode(text, {channel: "y", field: "MapY", rangeExtent: 550});