let scn = msc.scene();
let dt = await msc.csv("datasets/csv/survey_response.csv");

let rect = scn.mark("rect", {top: 100, left: 200, width: 700, height: 30, strokeWidth: 0, fillColor: "#ddd"});

let collection = scn.repeat(rect, dt, {field: "Age Group"});
collection.layout = msc.layout("grid", {numCols: 1, rowGap: 10});

let bars = scn.divide(rect, dt, {field: "Response", orientation: "horizontal"});

let enc = scn.encode(bars.children[0], {field: "Percentage", channel:"width"});
let colorMapping = {"Strongly agree": "#1e71b8", "Agree": "#7799cf", "Disagree": "#e29d6f", "Strongly disagree": "#da7c43"};
scn.encode(bars.children[0],{field: "Response", channel: "fillColor", mapping: colorMapping});

let agreeBars = scn.find([{field: "Response", value: "Agree"}]);
scn.align(agreeBars, "right");

let text = scn.mark("text", {fillColor: "white"});
scn.repeat(text, dt);
scn.encode(text, {field: "Percentage", channel: "text"});
scn.affix(text, bars.children[0], "x");
scn.affix(text, bars.children[0], "y");
scn.legend("fillColor", "Response", {x: 800, y: 100});
//scn.axis("y", "Age Group", {orientation: "left", pathX: 190, pathVisible: false, tickVisible: false});
scn.axis("y", "Age Group", {orientation: "left", pathVisible: false, tickVisible: false});

// msc.renderer("svg").render(scn, "svgElement", {collectionBounds: false});