let scene = msc.scene();
let data = await msc.csv("csv/us_state_unemployment_final.csv");
let rect = scene.mark("rect", {top:100, left: 100, width: 60, height: 50, strokeColor: "#fff", strokeWidth: 1, fillColor: "#ccc"});

scene.repeat(rect, data, {field: "State"});
let xEnc = scene.encode(rect, {field: "MapX", channel: "x", rangeExtent: 950});
let yEnc = scene.encode(rect, {field: "MapY", channel: "y", rangeExtent: 550});

let coll = scene.divide(rect, data, {field: "Year", orientation: "horizontal"});
let htEnc = scene.encode(coll.firstChild, {field: "Unemployment", channel: "height"});
// scene.encode(coll.firstChild, {field: "US Avg", channel: "fillColor", mapping: {"Above Average": "#B6293E", "Below Average": "#477EC0"}});
scene.encode(coll.firstChild, {field: "US Avg", channel: "fillColor", mapping: {"Above Average": "#D0605E", "Below Average": "#6A9F58"}});

let text = scene.mark("text", {x: 0, y:90});
scene.repeat(text, data, {field: "State"});
scene.encode(text, {channel: "text", field: "State"});
scene.affix(text, coll, "x");
scene.encode(text, {channel: "y", field: "MapY", rangeExtent: 550});