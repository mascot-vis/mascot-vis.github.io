let scn = msc.scene();
let data = await msc.graphJSON("/datasets/graphjson/seqsynopsis.json");
//let data = await msc.graphJSON("/datasets/graphjson/CHICAGO_SeasonD2O_short+seqsynopsis_alpha0.05.json");

let bg = scn.mark("rect", {fillColor: "#ddd", left: 100, top: 100, width: 20, strokeWidth: 0, opacity: 0.2});
msc.repeat(bg, data.nodeTable, {attribute: "pattern"});

let evtBg = scn.mark("rect", {left: 200, top: 100, width: 40, height: 11, strokeColor: "#eee"}), 
    evtNm = scn.mark("text", {x: 200, y: 100}),
    evtCnt = scn.mark("text", {x: 200, y: 100, fillColor: "#006594", fontSize: "12px", fontWeight: "bold"})
    ;
let glyph = scn.glyph(evtBg, evtNm, evtCnt);
msc.repeat(glyph, data.nodeTable);
msc.encode(evtNm, "text", "event_attribute");
msc.encode(evtCnt, "text", "value_event");
msc.encode(bg, "width", "value", {aggregator: "min", rangeExtent: 40, includeZero: true});
msc.encode(evtBg, "width", "value_event", {rangeExtent: 40, includeZero: true});

let xEnc = msc.encode(evtBg, "x", "pattern", {rangeExtent: 400});
let yEnc = msc.encode(glyph, "y", "average_index", {rangeExtent: 450, flipScale: true});
let se = msc.findElements(scn, [{attribute: "event_attribute", type: "list", value: ["_Start", "_Exit"]}, {property: "type", type: "list", value: ["text", "rect"]}]);
se.forEach(d => d.visibility = "hidden");

msc.affix(evtNm, evtBg, "x", {elementAnchor: "right", baseAnchor: "left", offset: -10});
msc.affix(evtNm, evtBg, "y");
msc.affix(evtCnt, evtBg, "x", {elementAnchor: "left", baseAnchor: "right", offset: 10});
msc.affix(evtCnt, evtBg, "y");

msc.encode(bg, "x", "pattern", {shareScale: xEnc});
msc.encode(evtBg, "fillColor", "event_attribute");
msc.encode(bg.topSegment, "y", "average_index", {aggregator: "min", shareScale: yEnc});
msc.encode(bg.bottomSegment, "y", "average_index", {aggregator: "max", shareScale: yEnc});