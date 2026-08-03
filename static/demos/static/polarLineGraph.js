let scene = msc.scene({fillColor: "#111"});

scene.mark("text", {x: 375, y: 15, text: "Rising CO2: a polar view of the Keeling Curve", fontSize: "1.25em", fontWeight: "bold", fillColor: "#eee", anchor: ["middle", "top"]});
scene.mark("text", {x: 375, y: 41, text: "Mauna Loa Observatory, monthly, 2006-2026 -- angle = month, radius = ppm", fontSize: "0.8em", fillColor: "#ddd", anchor: ["middle", "top"]});

let co2Table = await msc.csv("/datasets/csv/co2MaunaLoa.csv");

let cx = 375, cy = 300, outerRadius = 180;
//ppm range: 379.04 432.34

let guide = scene.mark("line", {x1: 100, y1: 100, x2: 300, y2: 500, strokeWidth: 3, strokeColor: "#f0c674", fillColor: "none"});
let co2Curve = msc.densify(guide, co2Table);

msc.encode(co2Curve.anyVertex, "polarAngle", "month", {domain: [1, 13], range: [90, -270], origin: [cx, cy]});
msc.encode(co2Curve.anyVertex, "polarRadius", "ppm", {domain: [360, 435], origin: [cx, cy], rangeExtent: outerRadius});

// Color the curve by its own ppm value at each vertex -- a PathGradient (one
// color per vertex, rendered as a chain of per-segment mini-gradients) rather
// than a single straight-axis gradient, since this curve loops around many
// times and a point's spatial position has no reliable relationship to its
// ppm value. Reuses the same color-scheme machinery as fillColor/strokeColor.
msc.encode(co2Curve, "strokeGradient", "ppm", {domain: [360, 435], scheme: "interpolateYlOrRd"});

let ppmRings = [375, 435];
scene.gridlines("polarRadius", "ppm", {values: ppmRings, strokeColor: "#444", textColor: "#aaa"});
scene.gridlines("polarAngle", "month", {values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], radius: outerRadius + 8, strokeColor: "#444"});

scene.axis("polarRadius", "ppm", {
    rotation: 0, // April's spoke
    tickValues: ppmRings, labelFormat: "d", titleVisible: false,
    strokeColor: "#444", textColor: "#aaa"
});
scene.axis("polarAngle", "month", {
    radius: outerRadius, tickValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    labelValues: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labelOffset: 20, pathVisible: false, tickVisible: false, titleVisible: false,
    textColor: "#999", fontSize: "0.7em"
});

scene.legend("strokeGradient", "ppm", {
    x: 630, y: 140, orientation: "vertical",
    textColor: "#ddd", strokeColor: "#666"
});
