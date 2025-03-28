//vertical 2x10
// let scn = msc.scene();
// let rect = scn.mark("rect", {top:100, left: 100, width: 16, height: 200, fillColor: "#fff"} );
// let dt = await msc.csv("/datasets/csv/olympic-medals.csv");

// let medals = scn.repeat(rect, dt, {attribute: "Medal_Type"});
// medals.layout = msc.layout("grid", {numRows: 1, colGap: 1});

// let bars = scn.repeat(medals, dt, {attribute: "Country_Code"});
// //todo: handle encoding before 2nd repeat
// let htEncoding = scn.encode(rect, {attribute: "Count", channel: "height"});
// scn.encode(rect, {attribute: "Medal_Type", channel: "fillColor", mapping: {"Gold": "#c9b037", "Silver": "#d7d7d7", "Bronze": "#ad8a56"}});

// bars.layout = msc.layout("grid", {numRows: 2, colGap: 20, rowGap: 35});

// scn.axis("x", "Country_Code", {orientation: "bottom"});
// scn.axis("height", "Count", {"orientation": "left"});
// scn.gridlines("height", "Count");
// let legend = scn.legend("fillColor", "Medal_Type", {x: 800, y: 100});

//horizontal 5X4
let scn = msc.scene();
let rect = scn.mark("rect", {top:100, left: 100, width: 200, height: 16, fillColor: "#fff"} );
let dt = await msc.csv("/datasets/csv/olympic-medals.csv");

let medals = scn.repeat(rect, dt, {attribute: "Medal_Type"});
medals.layout = msc.layout("grid", {numCols: 1, rowGap: 1});

let bars = scn.repeat(medals, dt, {attribute: "Country_Code"});
//todo: handle encoding before 2nd repeat
let htEncoding = scn.encode(rect, {attribute: "Count", channel: "width"});
scn.encode(rect, {attribute: "Medal_Type", channel: "fillColor", mapping: {"Gold": "#c9b037", "Silver": "#d7d7d7", "Bronze": "#ad8a56"}});

bars.layout = msc.layout("grid", {numRows: 5, colGap: 40, rowGap: 55});

scn.axis("y", "Country_Code", {orientation: "left", tickVisible: false, pathVisible: false, titleVisible: false});
scn.axis("width", "Count", {"orientation": "bottom", titleVisible: false});
scn.gridlines("width", "Count", {strokeColor: "#eee"});
scn.legend("fillColor", "Medal_Type", {x: 1050, y: 100});