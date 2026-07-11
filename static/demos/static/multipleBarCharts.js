let scene = msc.scene();
let data = await msc.csv("/datasets/csv/us_state_unemployment_final.csv");
let rect = scene.mark("rect", {top:100, left: 100, width: 60, height: 50, strokeColor: "#fff", strokeWidth: 1, fillColor: "#ccc"});

msc.repeat(rect, data, {attribute: "State"});

//TODO: support encode first then divide
//TODO: test repeat + repeat

let {newMark:yearRect, collection:coll} = msc.divide(rect, data, {attribute: "Year", orientation: "horizontal"});
let xEnc = msc.encode(coll, "x", "MapX", {rangeExtent: 950});
let yEnc = msc.encode(coll, "y", "MapY", {rangeExtent: 550});
let htEnc = msc.encode(yearRect, "height", "Unemployment");
// msc.encode(coll.firstChild, {attribute: "US Avg", channel: "fillColor", mapping: {"Above Average": "#B6293E", "Below Average": "#477EC0"}});
msc.encode(yearRect, "fillColor", "US Avg", {mapping: {"Above Average": "#D0605E", "Below Average": "#6A9F58"}});

//TODO: fix bug when changing xEnc/yEnc extent

let text = scene.mark("text", {x: 0, y:90});
msc.repeat(text, data, {attribute: "State"});
msc.encode(text, "text", "State");
msc.affix(text, coll, "x");
msc.encode(text, "y", "MapY", {rangeExtent: 550});