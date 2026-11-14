// Demonstrates the "spiral" layout: children are placed along an Archimedean
// spiral, each one a bit farther from the center and rotated a bit further
// than the last (radius(i) = startRadius + radiusStep * i,
// angle(i) = startAngle + direction * angleStep * i).
let scene = msc.scene();

let dot = scene.mark("circle", {radius: 4, fillColor: "#4c78a8"});

let rows = [];
for (let i = 0; i < 40; i++) rows.push({i});
let dt = msc.table(rows);

let coll = msc.repeat(dot, dt);
coll.layout = msc.layout("spiral", {x: 250, y: 220, startRadius: 8, radiusStep: 5, angleStep: 25});

// Grow the dots as the spiral winds outward, so later (farther-out) points
// read as "later" in whatever sequence "i" represents.
msc.encode(dot, "radius", "i", {rangeExtent: 12});
