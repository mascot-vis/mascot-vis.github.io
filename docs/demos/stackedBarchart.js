let scn = msc.scene();
let rect = scn.mark("rect", {top:100, left: 100, width: 20, height: 390, fillColor: "#fff"} );
//let rect = scn.mark("rect", {top:100, left: 100, width: 400, height: 20, fillColor: "#fff"} );
let dt = await msc.csv("datasets/csv/olympic-medals.csv");

let countries = scn.repeat(rect, dt, {field: "Country_Code"});
countries.layout = msc.layout("grid", {numRows: 1, colGap: 15, rowGap: 10});
scn.divide(rect, dt, {orientation: "vertical", field: "Medal_Type"});

let htEncoding = scn.encode(rect, {field: "Count", channel: "height"});
let fillEnc = scn.encode(rect, {field: "Medal_Type", channel: "fillColor", mapping: {"Gold": "#c9b037", "Silver": "#d7d7d7", "Bronze": "#ad8a56"}});

// scn.axis("width", "Count", {orientation: "bottom"});
// scn.axis("y", "Country_Code", {orientation: "right"});
scn.axis("height", "Count", {orientation: "left"});
scn.axis("x", "Country_Code", {orientation: "bottom"});
scn.legend("fillColor", "Medal_Type", {x: 700, y: 200});