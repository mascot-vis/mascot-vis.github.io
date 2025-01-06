let scn = msc.scene();
let rect = scn.mark("rect", {top:100, left: 200, width: 20, height: 300, fillColor: "#84BC66", strokeWidth: 0} );
let dt = await msc.csv("/datasets/csv/GDP Change.csv");

let quarters = scn.repeat(rect, dt, {attribute: "Quarter"});
quarters.layout = msc.layout("grid", {numRows: 1, colGap: 1});

let years = scn.repeat(quarters, dt, {attribute: "Year"});
years.layout = msc.layout("grid", {numRows: 1, colGap: 16});

let enc = scn.encode(rect, {attribute: "% Change", channel: "height"});
scn.axis("x", "Quarter", {orientation: "bottom", tickVisible: false, pathVisible: false, titleVisible: false});
scn.axis("x", "Year", {orientation: "bottom", pathY: 254, labelFormat: "%Y", tickVisible: false, labelOffset: 180, titleVisible: false});
scn.axis("height", "% Change", {orientation: "left"});
scn.gridlines("height", "% Change");

// let dt2 = await msc.csv("/datasets/csv/olympic-medals.csv");
// scn.repopulate(years, dt2, {"Year":"Country_Code", "Quarter":"Medal_Type"});
// scn.encode(rect, {attribute: "Count", channel: "height"});
// scn.encode(rect, {attribute: "Medal_Type", channel: "fillColor"});
// scn.axis("x", "Country_Code", {orientation: "bottom", tickVisible: false, pathVisible: false});
// scn.axis("height", "Count", {orientation: "left"});
