let scene = msc.scene();
let csv = await msc.csv("/datasets/csv/probability.csv");
let data = scene.transform("kde", csv, {attribute: "Probability", newAttribute: "Probability_density", groupBy: ["Category"], min: -10, interval: 2.5, max: 150, bandwidth: 7});
let rect = scene.mark("rect", {top:30, left: 200, width: 400, height: 100, strokeColor: "#222", strokeWidth: 1, fillColor: "#84BC66"});
let Levels = msc.repeat(rect, data, {attribute: "Category"});
msc.sortChildren(Levels, "Category", false, ["Almost Certainly", "Highly Likely", "Very Good Chance", "Probable", "Likely", "Probably", "We Believe", "Better Than Even", "About Even", "We Doubt", "Improbable", "Unlikely", "Probably Not", "Little Chance", "Almost No Chance", "Highly Unlikely", "Chances Are Slight"]);
// Levels.layout = msc.layout("grid", {numCols: 1, rowGap: -70});
let anyLevel = msc.densify(Levels.firstChild, data, {orientation: "horizontal", attribute: "Probability"});
let xEncoding = msc.encode(anyLevel.topLeftVertex, {channel: "x", attribute: "Probability"});
msc.encode(anyLevel.bottomLeftVertex, {channel: "x", attribute: "Probability", shareScale: xEncoding});
let htEncoding = msc.encode(anyLevel, {channel: "height", attribute: "Probability_density"});
Levels.layout = msc.layout("grid", {numCols: 1, rowGap: -70});
msc.update(anyLevel, {curveMode: "basis"})
scene.axis("x", "Probability", {orientation: "bottom"});
scene.axis("y", "Category", {orientation: "right", tickAnchor: "bottom", pathVisible: false, tickVisible: false, titleVisible: false});