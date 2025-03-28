let scn = msc.scene();
let data = await msc.graphjson("/datasets/graphjson/seqsynopsis.json");

let bg = scn.mark("rect", {fillColor: "#C8E6FA", left: 100, top: 100, width: 20, strokeWidth: 0}),
    clusterSize = scn.mark("text", {x: 200, y: 70});
scn.repeat(bg, data.nodeTable, {attribute: "pattern"});
scn.repeat(clusterSize, data.nodeTable, {attribute: "pattern"});

let evtBg = scn.mark("rect", {left: 200, top: 100, width: 40, height: 1, strokeColor: "#006594"}), 
    evtNm = scn.mark("text", {x: 200, y: 100}),
    evtCnt = scn.mark("text", {x: 200, y: 100, fillColor: "#006594", fontSize: "12px", fontWeight: "bold"})
    ;
let glyph = scn.glyph(evtBg, evtNm, evtCnt);
scn.repeat(glyph, data.nodeTable);
scn.encode(evtNm, {channel: "text", attribute: "event_attribute"});
scn.encode(evtCnt, {channel: "text", attribute: "value_event"});
scn.encode(bg, {channel: "width", attribute: "value", aggregator: "max", rangeExtent: 40});
scn.encode(evtBg, {channel: "width", attribute: "value_event", rangeExtent: 40});
scn.encode(clusterSize, {channel: "text", attribute: "value", aggregator: "max", rangeExtent: 40});

let xEnc = scn.encode(evtBg, {channel: "x", attribute: "pattern", rangeExtent: 400});
let yEnc = scn.encode(glyph, {channel: "y", attribute: "average_index", rangeExtent: 450, flipScale: true});
scn.find([{attribute: "event_attribute", values: ["_Start", "_Exit"]}, {type: "glyph"}]).forEach(d => d.visibility = "hidden");

scn.affix(evtNm, evtBg, "x", {itemAnchor: "right", baseAnchor: "left", offset: -5});
scn.affix(evtNm, evtBg, "y");
scn.affix(evtCnt, evtBg, "x", {itemAnchor: "left", baseAnchor: "right", offset: 5});
scn.affix(evtCnt, evtBg, "y");

scn.encode(bg, {channel: "x", attribute: "pattern", scale: xEnc.scale});
scn.encode(clusterSize, {channel: "x", attribute: "pattern", scale: xEnc.scale});
scn.encode(bg.topSegment, {channel: "y", attribute: "average_index", aggregator: "min", scale: yEnc.scale});
scn.encode(bg.bottomSegment, {channel: "y", attribute: "average_index", aggregator: "max", scale: yEnc.scale});