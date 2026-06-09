let scene = msc.scene();
let data = await msc.csv("/datasets/csv/us_state_unemployment_final.csv");
let rect = scene.mark("rect", {top:100, left: 100, width: 60, height: 50, strokeColor: "#fff", strokeWidth: 1, fillColor: "#ccc"});

msc.repeat(rect, data, {attribute: "State"});

//TODO: support encode first then divide
//TODO: test repeat + repeat

let {newMark:yearRect, collection:coll} = msc.divide(rect, data, {attribute: "Year", orientation: "horizontal"});
let xEnc = msc.encode(coll, {attribute: "MapX", channel: "x", rangeExtent: 950});
let yEnc = msc.encode(coll, {attribute: "MapY", channel: "y", rangeExtent: 550});
let htEnc = msc.encode(yearRect, {attribute: "Unemployment", channel: "height"});
// msc.encode(coll.firstChild, {attribute: "US Avg", channel: "fillColor", mapping: {"Above Average": "#B6293E", "Below Average": "#477EC0"}});
msc.encode(yearRect, {attribute: "US Avg", channel: "fillColor", mapping: {"Above Average": "#D0605E", "Below Average": "#6A9F58"}});

//TODO: fix bug when changing xEnc/yEnc extent

let text = scene.mark("text", {x: 0, y:90});
msc.repeat(text, data, {attribute: "State"});
msc.encode(text, {channel: "text", attribute: "State"});
msc.affix(text, coll, "x");
msc.encode(text, {channel: "y", attribute: "MapY", rangeExtent: 550});