let scene = msc.scene();
let data = await msc.treejson("graphjson/coreflow_graph.json");
let rect = scene.mark("rect", {left: 100, top: 100, width: 100, height: 100});
scene.repeat(rect, data.linkTable);
let wdEnc = scene.encode(rect, {channel: "width", field: "count"});
let htEnc = scene.encode(rect, {channel: "height", field: "average_index"});