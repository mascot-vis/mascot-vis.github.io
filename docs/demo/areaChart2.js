let scene = msc.scene();
let data = await msc.csv("csv/nyt_netIncome.csv");
let rect = scene.mark("rect", {top:100, left: 100, width: 500, height: 250, strokeColor: "none", strokeWidth: 0.25, fillColor: "#ccc"});
let area = scene.densify(rect, data, {orientation: "horizontal", field: "Date"});
scene.encode(area, {channel: "height", field: "Net Income"});
scene.encode(area.firstVertexPair, {channel: "x", field: "Date"});
scene.encode(area, {channel: "fillGradient", field: "Net Income", scheme: "interpolateRdYlBu"});
scene.axis("x", "Date", {orientation: "bottom", labelFormat: "%m/%d/%y"});
scene.axis("height", "Net Income", {orientation: "left", labelFormat: ".2s"});