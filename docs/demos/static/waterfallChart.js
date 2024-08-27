let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/account_balance.csv");

let rect = scn.mark("rect", {top: 150, left: 100, width: 55, height: 160, strokeWidth: 0, fillColor: "#ddd"})

let collection = scn.repeat(rect, dt, {attribute: "Period"});
collection.layout = msc.layout("grid", {numRows: 1, colGap: 3});

let enc = scn.encode(rect.topSegment,{attribute: "Current", channel:"y"});
scn.encode(rect.bottomSegment,{attribute: "Previous", channel:"y", shareScale: enc});
enc.rangeExtent = 300;
let colorMapping = {"Total": "#00acec", "Down": "#cc1a59", "Up": "#2e944f"};
scn.encode(rect, {attribute: "Category", channel:"fillColor", mapping: colorMapping});

let label = scn.mark("text", {x: 100, y:100, fillColor: "white"});
scn.repeat(label, dt, {attribute: "Period"});
scn.encode(label, {attribute: "Delta", channel: "text"});
scn.affix(label, rect, "x");
scn.affix(label, rect, "y");

scn.axis("x", "Period", {orientation: "bottom", titleVisible: false});
scn.axis("y", "Current", {orientation: "left", pathVisible: false, tickVisible: false, labelFormat: ".2s", titleVisible: false});
scn.legend("fillColor", "Category", {x: 960, y: 100});
scn.gridlines("y", "Current");