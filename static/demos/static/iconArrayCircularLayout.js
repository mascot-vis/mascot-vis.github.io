let scene = msc.scene();
let heartFilled = "M12 21s-6.7-4.35-9.3-8.2C1.1 10.9 1.5 8 3.6 6.4 5.6 4.9 8.3 5.4 9.8 7.2L12 9.8l2.2-2.6c1.5-1.8 4.2-2.3 6.2-.8 2.1 1.6 2.5 4.5.9 6.4C18.7 16.65 12 21 12 21z",
    heartOutline = "M12 21s-6.7-4.35-9.3-8.2C1.1 10.9 1.5 8 3.6 6.4 5.6 4.9 8.3 5.4 9.8 7.2L12 9.8l2.2-2.6c1.5-1.8 4.2-2.3 6.2-.8 2.1 1.6 2.5 4.5.9 6.4C18.7 16.65 12 21 12 21zm0-2.4c2.2-1.5 6.1-4.6 7.7-6.5.9-1.1.7-2.7-.4-3.5-1-.8-2.5-.5-3.4.6L12 13.4 8.1 9.2c-.9-1.1-2.4-1.4-3.4-.6-1.1.8-1.3 2.4-.4 3.5C5.9 14 9.8 17.1 12 18.6z";

scene.mark("text", {x: 425, y: 60, text: "Icon arrays in circular layouts: markRotation settings", fontSize: "1.25em", fontWeight: "bold", fillColor: "#222", anchor: ["center", "top"]});

function heartPanel(x, y, markRotation) {
    let word = markRotation.replace(/([A-Z])/g, " $1").trim().toLowerCase();
    let icon = scene.mark("symbol", {x: 200, y: 100, width: 22, height: 22, viewBox: [0, 0, 24, 24], fillColor: "#e8617c"});
    let c = msc.repeat(icon, {filled: 8, empty: 4});
    c.layout = msc.layout("circular", {x, y, radius: 95, markRotation});
    msc.encode(icon, "path", "group", {mapping: {"filled": heartFilled, "empty": heartOutline}});
    scene.mark("text", {x, y, text: word, fontSize: "0.75em", fillColor: "#333", anchor: ["center", "middle"]});
}

// Row 1: the two "radial" outcomes, plus the baseline "upright" outcome.
heartPanel(165, 210, "inward");
heartPanel(420, 210, "outward");
heartPanel(685, 210, "upright");

// Row 2: the two "tangential" outcomes -- the heart's tip follows the
// direction of travel around the circle instead of pointing toward/away
// from the center.
heartPanel(300, 435, "tangentialClockwise");
heartPanel(555, 435, "tangentialCounterClockwise");
