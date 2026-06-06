let scn = msc.scene();
let line = scn.mark("line", {x1: 100, y1: 100, x2: 100, y2: 450, strokeColor: "#ccc"});

let dt = await msc.csv("/datasets/csv/bostonWeather.csv");

msc.repeat(line, dt, {attribute: "date"});
let xEnc = msc.encode(line, {attribute: "date", channel: "x"});
xEnc.rangeExtent = 680;

let topEnc = msc.encode(line.vertices[0], {attribute: "maxTemp", channel: "y"});
let btmEnc = msc.encode(line.vertices[1], {attribute: "minTemp", channel: "y", shareScale: topEnc});
topEnc.rangeExtent = 300;

msc.encode(line, {attribute: "meanTemp", channel: "strokeColor", scheme: "interpolateTurbo"});

scn.axis("x", "date", {orientation: "bottom", labelFormat: "%b %d, %Y", labelRotation: -45, titleVisible: false});
scn.axis("y", "maxTemp", {orientation: "left", title: "temperature"});
// scn.legend("strokeColor", "meanTemp", {x: 300, y: 500, orientation: "horizontal"});