let scn = msc.scene();
let rect = scn.mark("rect", {top:60, left: 200, width: 350, height: 16, fillColor: "#84BC66", strokeWidth: 0} );
let dt = await msc.csv("csv/GDP Change.csv");

let quarters = scn.repeat(rect, dt, {field: "Quarter"});
quarters.layout = msc.layout("grid", {numRows: 4, rowGap: 1});

let years = scn.repeat(quarters, dt, {field: "Year"});
years.layout = msc.layout("grid", {numCols: 1, rowGap: 16});

scn.encode(rect, {field: "% Change", channel: "width"});
scn.axis("y", "Quarter", {orientation: "left", tickVisible: false, pathVisible: false});
scn.axis("y", "Year", {orientation: "right", pathX: 370, labelFormat: "%Y", tickVisible: false, labelOffset: 220});
scn.axis("width", "% Change", {orientation: "bottom"});