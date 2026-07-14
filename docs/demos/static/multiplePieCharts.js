let scn = msc.scene();
let data = await msc.csv("/datasets/csv/household_spending.csv");

let circ = scn.mark("circle", {radius: 100, x: 300, y: 200, fillColor: "white"});
let coll1 = msc.repeat(circ, data, {attribute: "Country"});
coll1.layout = msc.layout("grid", {numRows: 1, colGap: 35});
let coll2 = msc.repeat(coll1, data, {attribute: "Year"});
coll2.layout = msc.layout("grid", {numCols: 1, rowGap: 55});
let {newMark:pie, collection:pieChart} = msc.divide(circ, data, {attribute: "Category"});
msc.encode(pie, "fillColor", "Category", {scheme: "schemeAccent"});
msc.encode(pie, "angle", "Percentage");

scn.legend("fillColor", "Category", {x: 670, y: 150});
scn.axis("x", "Country", {orientation: "top", pathVisible: false, tickVisible: false, titleVisible: false});
scn.axis("y", "Year", {orientation: "left", pathVisible: false, tickVisible: false, labelFormat: "%Y", titleVisible: false});