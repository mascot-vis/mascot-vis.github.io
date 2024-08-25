let scene = msc.scene();
let data = await msc.csv("/datasets/csv/bitcoin-price.csv");
// rect.divide first
// let fill = msc.linearGradient({x1: 0, y1: 0, x2: 0, y2: 100});
// fill.addStop(0, "#EFC030", 1.0);
// fill.addStop(80, "#EFC030", 1.0);
// fill.addStop(100, "#F9E5AF", 1.0);
let rect = scene.mark("rect", {top:60, left: 100, width: 700, height: 450, strokeColor: "#ffcc00", strokeWidth: 0.25, fillColor: "#EFC030"});
let area = scene.densify(rect, data, {orientation: "horizontal", attribute: "date"});
let xEnc = scene.encode(area.topLeftVertex, {channel: "x", attribute: "date", rangeExtent: 700});
scene.encode(area.bottomLeftVertex, {channel: "x", attribute: "date", shareScale: xEnc});
scene.encode(area, {channel: "height", attribute: "value"});

scene.axis("x", "date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scene.axis("height", "value", {orientation: "left", labelFormat: ".2s"});