//other names: Variable Width Bar Chart, variable width histogram, cascade chart, or Marimekko chart
let scn = msc.scene();
let rect = scn.mark("rect", {top:100, left: 100, width: 800, height: 300, fillColor: "#fff"} );
let dt = await msc.csv("/datasets/csv/dummy.csv");

let names = msc.divide(rect, dt, {orientation: "horizontal", attribute: "name"});
let wdEncoding = msc.encode(rect, "width", "width"),
	htEncoding = msc.encode(rect, "height", "height");

// scn.setVertAlignment(rect, "top");
names.layout.vertCellAlignment = "top";

msc.update(rect, {fillColor: "#B0D9E4", opacity: "0.9", strokeColor: "#fff"});

scn.axis("height", "height", {orientation: "left", flip: true});
scn.axis("x", "name", {orientation: "top", attribute: "name"});

// let r = msc.renderer("svg");
// r.render(scn, "svgElement");	