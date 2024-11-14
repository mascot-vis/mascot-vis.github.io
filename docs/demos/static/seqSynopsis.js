let scn = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/seqsynopsis.json");
//let data = await msc.graphJSON("/datasets/graphjson/CHICAGO_SeasonD2O_short+seqsynopsis_alpha0.05.json");

let bg = scn.mark("rect", {fillColor: "#ddd", left: 100, top: 100, width: 20, strokeWidth: 0, opacity: 0.2});
scn.repeat(bg, data.nodeTable, {attribute: "pattern"});

let evtBg = scn.mark("rect", {left: 200, top: 100, width: 40, height: 11, strokeColor: "#eee"}), 
    evtNm = scn.mark("text", {x: 200, y: 100}),
    evtCnt = scn.mark("text", {x: 200, y: 100, fillColor: "#006594", fontSize: "12px", fontWeight: "bold"})
    ;
let glyph = scn.glyph(evtBg, evtNm, evtCnt);
scn.repeat(glyph, data.nodeTable);
scn.encode(evtNm, {channel: "text", attribute: "event_attribute"});
scn.encode(evtCnt, {channel: "text", attribute: "value_event"});
scn.encode(bg, {channel: "width", attribute: "value", aggregator: "min", rangeExtent: 40, includeZero: true});
scn.encode(evtBg, {channel: "width", attribute: "value_event", rangeExtent: 40, includeZero: true});

let xEnc = scn.encode(evtBg, {channel: "x", attribute: "pattern", rangeExtent: 400});
let yEnc = scn.encode(glyph, {channel: "y", attribute: "average_index", rangeExtent: 450, flipScale: true});
let se = scn.findElements([{attribute: "event_attribute", type: "list", value: ["_Start", "_Exit"]}, {property: "type", type: "list", value: ["text", "rect"]}]);
se.forEach(d => d.visibility = "hidden");

scn.affix(evtNm, evtBg, "x", {elementAnchor: "right", baseAnchor: "left", offset: -10});
scn.affix(evtNm, evtBg, "y");
scn.affix(evtCnt, evtBg, "x", {elementAnchor: "left", baseAnchor: "right", offset: 10});
scn.affix(evtCnt, evtBg, "y");

scn.encode(bg, {channel: "x", attribute: "pattern", shareScale: xEnc});
scn.encode(evtBg, {channel: "fillColor", attribute: "event_attribute"});
scn.encode(bg.topSegment, {channel: "y", attribute: "average_index", aggregator: "min", shareScale: yEnc});
scn.encode(bg.bottomSegment, {channel: "y", attribute: "average_index", aggregator: "max", shareScale: yEnc});