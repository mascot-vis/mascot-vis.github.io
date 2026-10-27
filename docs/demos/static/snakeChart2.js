// Snake chart of the 2020 US presidential election (Workflow 2: repeat a path per state, then stack the
// paths along a snake). Each state is its own path; a stack layout along a snake-shaped guide lays them
// end to end, ordered by margin, sized by electoral votes and colored by margin; a line marks where the
// running total reaches 270 votes. (Workflow 1, in snakeChart.js, draws the snake first and divides it.)

let scn = msc.scene();
// One row per state, sorted by margin. Margin = Biden % minus Trump % (> 0: Biden won).
let stateTbl = await msc.csv("/datasets/csv/elections-2020-snake.csv");

const BAND = 26;   // band thickness (px)

// ---- One path per state; the layout below replaces this short placeholder with each state's piece of the snake ----
let piece = scn.mark("path", {d: "M 100 100 H 150", strokeWidth: BAND});

// The snake guide: 12 vertical runs joined by half-circle turns. "V y" draws a straight run to height y,
// and "a r r 0 0 sweep dx 0" is a half-circle turn to the next run (sweep 0 = bottom turn, 1 = top turn).
// The turn radius (21.45) must exceed half the band thickness so the inner curves don't fold over.
let states = msc.repeat(piece, stateTbl, {attribute: "State", layout: msc.layout("grid", {numCols: 7})});
msc.sortChildren(states, "Margin", true);               // Biden's largest margin first
let lenEnc = msc.encode(piece, "length", "EV");          // the states' votes fill the whole snake
msc.encode(piece, "strokeColor", "Margin", {domain: [-120, 120], scheme: "interpolateRdBu"});


states.layout = msc.layout("stack", {
    orientation: "path", gap: 1,          // gap: white cuts across the band between states
    d: `M 108.5 245
        V 336    a 21.45 21.45 0 0 0 42.9 0   V 160.5  a 21.45 21.45 0 0 1 42.9 0   V 355.5  a 21.45 21.45 0 0 0 42.9 0
        V 95.5   a 21.45 21.45 0 0 1 42.9 0   V 388    a 21.45 21.45 0 0 0 42.9 0   V 141    a 21.45 21.45 0 0 1 42.9 0
        V 355.5  a 21.45 21.45 0 0 0 42.9 0   V 108.5  a 21.45 21.45 0 0 1 42.9 0   V 401    a 21.45 21.45 0 0 0 42.9 0
        V 163.75 a 21.45 21.45 0 0 1 42.9 0   V 342.5  a 21.45 21.45 0 0 0 42.9 0   V 251.5`
});

// ---- State labels, centered on each piece and turned along the band ----
let label = scn.mark("text", {fontSize: "11px", fillColor: "#222"});
msc.repeat(label, stateTbl, {attribute: "State"});
msc.encode(label, "text", "Abbr");
msc.affix(label, piece, "along", {rotate: "tangent"});

// ---- 270 marker: a vertical line where the running total of electoral votes reaches 270 ----
let midline = scn.mark("line", {x1: 0, x2: 0, strokeColor: "#222", strokeWidth: 1.5, strokeDash: "4 2"});    // vertical
msc.affix(midline, states, "x", {baseAnchor: {value: 270, encoding: lenEnc}});
msc.affix(midline, states, "y1", {baseAnchor: "top", offset: -(BAND / 2 + 10)});
msc.affix(midline, states, "y2", {baseAnchor: "bottom", offset: BAND / 2 + 10});

let midLabel = scn.mark("text", {text: "270 electoral votes", fontSize: "12px", fontWeight: "bold",
    fillColor: "#222"});
msc.affix(midLabel, midline, "x");
msc.affix(midLabel, midline, "y", {baseAnchor: "top", offset: -10});
