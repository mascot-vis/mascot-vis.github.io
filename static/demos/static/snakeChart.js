// Snake chart of the 2020 US presidential election (Workflow 1: draw the snake, then divide it).
// One thick, winding path is divided into one piece per state. Pieces are ordered by margin,
// sized by electoral votes and colored by margin, so the halfway point of the path is 270 votes.
//
// NOTE: this demo assumes features that are NOT implemented yet:
//   (new 1) divide() on a path: cut a path into consecutive pieces along its length
//   (new 2) a "length" channel: pieces share the path's total length in proportion to the data
//   (new 3) a diverging color scale centered at a value (scaleType "diverging", midpoint)
//   (new 4) affix(..., "along", ...): place an element at a position along a path piece,
//           turned to the path's direction (tangent) or across it (normal)
//   (new 5) a gap between the pieces of a divided path (the stack layout's gap): white cuts across the band
// Everything else uses the current API.

let scn = msc.scene();
// One row per state, sorted by margin. Margin = Biden % minus Trump % (> 0: Biden won).
// Label = full name for states with 10+ electoral votes, otherwise the abbreviation.
// Tipping = "yes" for the state whose votes take the running total (from Biden's safest state) past 270.
let stateTbl = await msc.csv("/datasets/csv/elections-2020-snake.csv");

// ---- The snake: 12 vertical runs joined by half-circle turns ----
// SVG path data: "V y" draws a straight run to height y, and "a r r 0 0 sweep dx 0" is a
// half-circle turn to the next run (sweep 0 = bottom turn, 1 = top turn).
// The turn radius (21.45) must exceed half the band thickness so the inner curves don't fold over.
const BAND = 26;   // band thickness (px)

let snake = scn.mark("path", {
    strokeWidth: BAND, strokeColor: "#ddd", fillColor: "none",
    d: `M 108.5 245
        V 336    a 21.45 21.45 0 0 0 42.9 0   V 160.5  a 21.45 21.45 0 0 1 42.9 0   V 355.5  a 21.45 21.45 0 0 0 42.9 0
        V 95.5   a 21.45 21.45 0 0 1 42.9 0   V 388    a 21.45 21.45 0 0 0 42.9 0   V 141    a 21.45 21.45 0 0 1 42.9 0
        V 355.5  a 21.45 21.45 0 0 0 42.9 0   V 108.5  a 21.45 21.45 0 0 1 42.9 0   V 401    a 21.45 21.45 0 0 0 42.9 0
        V 163.75 a 21.45 21.45 0 0 1 42.9 0   V 342.5  a 21.45 21.45 0 0 0 42.9 0   V 251.5`
});

let {newMark: piece, collection: states} = msc.divide(snake, stateTbl, {attribute: "State"});
msc.update(states.layout, {gap: 1});                  // white cuts across the band between states
msc.sortChildren(states, "Margin", true);               // Biden's largest margin first
let lenEnc = msc.encode(piece, "length", "EV");
msc.encode(piece, "strokeColor", "Margin", {domain: [-120, 120], scheme: "interpolateRdBu"});
let label = scn.mark("text", {fontSize: "11px", fillColor: "#222"});
msc.repeat(label, stateTbl, {attribute: "State"});
msc.encode(label, "text", "Abbr");
msc.affix(label, piece, "along", {rotate: "tangent"});

let midline = scn.mark("line", {x1: 0, x2: 0, strokeColor: "#222", strokeWidth: 1.5, strokeDash: "4 2"});    // vertical
msc.affix(midline, states, "x", {baseAnchor: {value: 270, encoding: lenEnc}});
msc.affix(midline, states, "y1", {baseAnchor: "top", offset: -(BAND / 2 + 10)});
msc.affix(midline, states, "y2", {baseAnchor: "bottom", offset: BAND / 2 + 10});

let midLabel = scn.mark("text", {text: "270 electoral votes", fontSize: "12px", fontWeight: "bold",
    fillColor: "#222"});
msc.affix(midLabel, midline, "x");
msc.affix(midLabel, midline, "y", {baseAnchor: "top", offset: -10});