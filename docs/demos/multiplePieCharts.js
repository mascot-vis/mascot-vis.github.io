let scn = msc.scene();
let data = await msc.csv("datasets/csv/household_spending.csv");

let circ = scn.mark("circle", {radius: 100, x: 300, y: 200, fillColor: "white"});
let coll1 = scn.repeat(circ, data, {field: "Country"});
coll1.layout = msc.layout("grid", {numRows: 1, colGap: 35});
let coll2 = scn.repeat(coll1, data, {field: "Year"});
coll2.layout = msc.layout("grid", {numCols: 1, rowGap: 55});
let pieChart = scn.divide(circ, data, {field: "Category"});
let anyPie = pieChart.children[0];
scn.encode(anyPie, {field: "Category", channel: "fillColor", scheme: "schemeAccent"});
scn.encode(anyPie, {field: "Percentage", channel: "angle"});

scn.legend("fillColor", "Category", {x: 670, y: 150});
scn.axis("x", "Country", {orientation: "top", pathVisible: false, tickVisible: false});
scn.axis("y", "Year", {orientation: "left", pathVisible: false, tickVisible: false, labelFormat: "%Y"});