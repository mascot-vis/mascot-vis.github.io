let scn = msc.scene();
let rect = scn.mark("rect", {top:60, left: 200, width: 350, height: 16, fillColor: "#84BC66", strokeWidth: 0} );
let dt = await msc.csv("/datasets/csv/GDP Change.csv");

let quarters = scn.repeat(rect, dt, {attribute: "Quarter"});
quarters.layout = msc.layout("grid", {numRows: 4, rowGap: 1});

let years = scn.repeat(quarters, dt, {attribute: "Year"});
years.layout = msc.layout("grid", {numCols: 1, rowGap: 16});

let enc = scn.encode(rect, {attribute: "% Change", channel: "width"});
// enc.rangeExtent = 500;

scn.axis("y", "Quarter", {orientation: "left", tickVisible: true, pathVisible: true, titleVisible: false});
scn.axis("y", "Year", {orientation: "right", pathX: 370, labelFormat: "%Y", tickVisible: false, labelOffset: 220, titleVisible: false});
scn.axis("width", "% Change", {orientation: "bottom"});
scn.gridlines("width", "% Change");

// scn.setProperties(rect, {height: 30});

// scn.translate(years, 200, 200);
