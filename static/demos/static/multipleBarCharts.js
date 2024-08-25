let scene = msc.scene();
let data = await msc.csv("/datasets/csv/us_state_unemployment_final.csv");
let rect = scene.mark("rect", {top:100, left: 100, width: 60, height: 50, strokeColor: "#fff", strokeWidth: 1, fillColor: "#ccc"});

scene.repeat(rect, data, {attribute: "State"});

//TODO: support encode first then divide
//TODO: test repeat + repeat

let {newMark:yearRect, collection:coll} = scene.divide(rect, data, {attribute: "Year", orientation: "horizontal"});
let xEnc = scene.encode(coll, {attribute: "MapX", channel: "x", rangeExtent: 950});
let yEnc = scene.encode(coll, {attribute: "MapY", channel: "y", rangeExtent: 550});
let htEnc = scene.encode(yearRect, {attribute: "Unemployment", channel: "height"});
// scene.encode(coll.firstChild, {attribute: "US Avg", channel: "fillColor", mapping: {"Above Average": "#B6293E", "Below Average": "#477EC0"}});
scene.encode(yearRect, {attribute: "US Avg", channel: "fillColor", mapping: {"Above Average": "#D0605E", "Below Average": "#6A9F58"}});

//TODO: fix bug when changing xEnc/yEnc extent

let text = scene.mark("text", {x: 0, y:90});
scene.repeat(text, data, {attribute: "State"});
scene.encode(text, {channel: "text", attribute: "State"});
scene.affix(text, coll, "x");
scene.encode(text, {channel: "y", attribute: "MapY", rangeExtent: 550});