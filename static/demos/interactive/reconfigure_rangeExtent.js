let scn = msc.scene();
let rect = scn.mark("rect", {top:100, left: 200, width: 400, height: 20, strokeWidth: 0, fillColor: "orange"} );
let dt = await msc.csv("/datasets/csv/projectTimeline.csv");

let bars = msc.repeat(rect, dt, {attribute: "Task"});
//bind y to Task would also work
bars.layout = msc.layout("grid", {numCols: 1, rowGap: 5});

let enc = msc.encode(rect.leftSegment, {attribute: "Start Date", channel: "x"});
msc.encode(rect.rightSegment, {attribute: "End Date", channel: "x", shareScale: enc});
enc.rangeExtent = 600;
let xAxis = scn.axis("x", "Start Date", {orientation: "top", labelFormat: "%m/%d", title: "Date"});
scn.axis("y", "Task", {orientation: "left", titleVisible: false});
scn.gridlines("x", "Start Date");
scn.gridlines("y", "Task");

let trigger = { target: xAxis, event: "dragX" },
    responder = { component: enc, properties: ["rangeExtent"] },
    updater = (condMet, ctx, compnt) => {
        compnt.rangeExtent = compnt.getRangeExtent(rect.leftSegment) + ctx.get("dx");
    };
let tg = msc.activate(trigger, responder, undefined, updater);

let renderer = msc.renderer("svg", "svgElement");
renderer.render(scn);