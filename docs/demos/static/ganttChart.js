let scn = msc.scene();
let rect = scn.mark("rect", {top:100, left: 200, width: 400, height: 20, strokeWidth: 0, fillColor: "orange"} );
let dt = await msc.csv("/datasets/csv/projectTimeline.csv");

let bars = scn.repeat(rect, dt, {attribute: "Task"});
//bind y to Task would also work
bars.layout = msc.layout("grid", {numCols: 1, rowGap: 5});

let enc = scn.encode(rect.leftSegment, {attribute: "Start Date", channel: "x"});
scn.encode(rect.rightSegment, {attribute: "End Date", channel: "x", shareScale: enc});
enc.rangeExtent = 600;
scn.axis("x", "Start Date", {orientation: "top", labelFormat: "%m/%d", title: "Date"});
scn.axis("y", "Task", {orientation: "left", titleVisible: false});
scn.gridlines("x", "Start Date");
scn.gridlines("y", "Task");


// let dt2 = await msc.csv("/datasets/csv/bostonWeather.csv");
// scn.repopulate(bars, dt2, {"Task":"date"});
// let enc1 = scn.encode(rect.leftSegment, {attribute: "minTemp", channel: "x"});
// scn.encode(rect.rightSegment, {attribute: "maxTemp", channel: "x", shareScale: enc1});
// scn.setProperties(rect, {"height": 5});
// scn.axis("x", "minTemp", {orientation: "top"});
// scn.gridlines("x", "minTemp");
