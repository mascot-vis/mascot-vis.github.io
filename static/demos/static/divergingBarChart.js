let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/survey_response.csv");

let rect = scn.mark("rect", {top: 100, left: 200, width: 700, height: 40, strokeWidth: 0, fillColor: "#ddd"});

let coll = msc.repeat(rect, dt, {attribute: "Age Group"});
coll.layout = msc.layout("grid", {numCols: 1, rowGap: 5});

let {newMark, collection} = msc.divide(rect, dt, {attribute: "Response", orientation: "horizontal"});

let enc = msc.encode(newMark, {attribute: "Percentage", channel:"width"});
let colorMapping = {"Strongly agree": "#1e71b8", "Agree": "#7799cf", "Disagree": "#e29d6f", "Strongly disagree": "#da7c43"};
msc.encode(newMark,{attribute: "Response", channel: "fillColor", mapping: colorMapping});
let agreeBars = msc.findElements(scn,[{attribute: "Response", value: "Agree"}]);
msc.align(agreeBars, "x", "right");
enc.rangeExtent = 150;

let text = scn.mark("text", {fillColor: "white"});
msc.repeat(text, dt);
msc.encode(text, {attribute: "Percentage", channel: "text"});
msc.affix(text, newMark, "x");
msc.affix(text, newMark, "y");
scn.legend("fillColor", "Response", {x: 700, y: 100});
// //scn.axis("y", "Age Group", {orientation: "left", pathX: 190, pathVisible: false, tickVisible: false});
scn.axis("y", "Age Group", {orientation: "left", pathVisible: false, tickVisible: false, titleVisible: false});

// msc.renderer("svg").render(scn, "svgElement", {collectionBounds: false});
