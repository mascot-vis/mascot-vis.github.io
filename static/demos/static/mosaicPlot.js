let scene = msc.scene();
let data = await msc.csv("/datasets/csv/gender-job-level.csv");
let rect = scene.mark("rect", {top:160, left: 150, width: 800, height: 650, strokeColor: "#fff", strokeWidth: 1, fillColor: "#ccc"});

let {newMark: jobMark} = msc.divide(rect, data, {orientation: "horizontal", attribute: "Job Type"});
let {newMark: genderMark} = msc.divide(jobMark, data, {orientation: "vertical", attribute: "Gender"});

msc.encode(genderMark, {channel: "fillColor", attribute: "Gender", mapping: {"Male": "#3F73B8", "Female": "#E97075"}});
let wdEncoding = msc.encode(genderMark, {channel: "width", attribute: "Percent Total"});
let htEncoding = msc.encode(genderMark, {attribute: "Percent Gender", channel: "height"});
wdEncoding.rangeExtent = 450;

scene.axis("x", "Job Type", {orientation: "bottom", labelRotation: -45, titleVisible: false});
scene.axis("width", "Percent Total", {orientation: "top", titleVisible: false});
scene.axis("height", "Percent Gender", {orientation: "left", titleVisible: false});
scene.legend("fillColor", "Gender", {x: 40, y: 160});