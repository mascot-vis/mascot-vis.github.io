let scn = atlas.scene();
let data = await atlas.graphjson("graphjson/seqsynopsis.json");

let bg = scn.mark("rect", {fillColor: "#C8E6FA", left: 100, top: 100, width: 20, strokeWidth: 0}),
    clusterSize = scn.mark("text", {x: 200, y: 70});
scn.repeat(bg, data.nodeTable, {field: "pattern"});
scn.repeat(clusterSize, data.nodeTable, {field: "pattern"});

let evtBg = scn.mark("rect", {left: 200, top: 100, width: 40, height: 1, strokeColor: "#006594"}), 
    evtNm = scn.mark("text", {x: 200, y: 100}),
    evtCnt = scn.mark("text", {x: 200, y: 100, fillColor: "#006594", fontSize: "12px", fontWeight: "bold"})
    ;
let glyph = scn.glyph(evtBg, evtNm, evtCnt);
scn.repeat(glyph, data.nodeTable);
scn.encode(evtNm, {channel: "text", field: "event_attribute"});
scn.encode(evtCnt, {channel: "text", field: "value_event"});
scn.encode(bg, {channel: "width", field: "value", aggregator: "max", rangeExtent: 40});
scn.encode(evtBg, {channel: "width", field: "value_event", rangeExtent: 40});
scn.encode(clusterSize, {channel: "text", field: "value", aggregator: "max", rangeExtent: 40});

let xEnc = scn.encode(evtBg, {channel: "x", field: "pattern", rangeExtent: 400});
let yEnc = scn.encode(glyph, {channel: "y", field: "average_index", rangeExtent: 450, flipScale: true});
scn.find([{field: "event_attribute", values: ["_Start", "_Exit"]}, {type: "glyph"}]).forEach(d => d.visibility = "hidden");

scn.affix(evtNm, evtBg, "x", {itemAnchor: "right", baseAnchor: "left", offset: -5});
scn.affix(evtNm, evtBg, "y");
scn.affix(evtCnt, evtBg, "x", {itemAnchor: "left", baseAnchor: "right", offset: 5});
scn.affix(evtCnt, evtBg, "y");

scn.encode(bg, {channel: "x", field: "pattern", scale: xEnc.scale});
scn.encode(clusterSize, {channel: "x", field: "pattern", scale: xEnc.scale});
scn.encode(bg.topSegment, {channel: "y", field: "average_index", aggregator: "min", scale: yEnc.scale});
scn.encode(bg.bottomSegment, {channel: "y", field: "average_index", aggregator: "max", scale: yEnc.scale});