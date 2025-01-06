let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/survey_response.csv");

let rect = scn.mark("rect", {top: 100, left: 200, width: 700, height: 40, strokeWidth: 0, fillColor: "#ddd"});

let coll = scn.repeat(rect, dt, {attribute: "Age Group"});
coll.layout = msc.layout("grid", {numCols: 1, rowGap: 5});

let {newMark, collection} = scn.divide(rect, dt, {attribute: "Response", orientation: "horizontal"});

let enc = scn.encode(newMark, {attribute: "Percentage", channel:"width"});
let colorMapping = {"Strongly agree": "#1e71b8", "Agree": "#7799cf", "Disagree": "#e29d6f", "Strongly disagree": "#da7c43"};
scn.encode(newMark,{attribute: "Response", channel: "fillColor", mapping: colorMapping});
let agreeBars = scn.findElements([{attribute: "Response", value: "Agree"}]);
scn.align(agreeBars, "x", "right");
enc.rangeExtent = 150;

let text = scn.mark("text", {fillColor: "white"});
scn.repeat(text, dt);
scn.encode(text, {attribute: "Percentage", channel: "text"});
scn.affix(text, newMark, "x");
scn.affix(text, newMark, "y");
scn.legend("fillColor", "Response", {x: 700, y: 100});
// //scn.axis("y", "Age Group", {orientation: "left", pathX: 190, pathVisible: false, tickVisible: false});
scn.axis("y", "Age Group", {orientation: "left", pathVisible: false, tickVisible: false, titleVisible: false});

// msc.renderer("svg").render(scn, "svgElement", {collectionBounds: false});
