let attrs = ['sepal.length', 'sepal.width', 'petal.length', 'petal.width'];
let axes = attrs.map(d => scn.getAxis(d, 'y'));
let polyline = scn.findElements([{property: "type", value: "path"}])[0];
let triggers = [];
for (let axis of axes)
    triggers.push({"target": axis, "event": "brushY"});

let responder = { component: polyline, channels: ["strokeColor", "opacity"] };
let evalFns = [];
for (let i = 0; i < 4; i++){
    evalFns.push(
        (ctx, compnt) => {
            let yInt = ctx.get("yInterval");
            return !yInt || (compnt.vertices[i].y >= yInt[0] && compnt.vertices[i].y <= yInt[1])
        }
    )
}

let highlighter = (condMet, ctx, compnt) => {
        if (!condMet) {
            scn.setProperties(compnt, { strokeColor: '#eee', opacity: 0.5 }, true);
            scn.setProperties(compnt.vertices[0], { fillColor: '#eee', opacity: 0.5 }, true);
            scn.setProperties(compnt.vertices[1], { fillColor: '#eee', opacity: 0.5 }, true);
        }
    };

let tgs = [];
for (let [i, t] of triggers.entries()) {
    tgs.push(scn.activate(t, responder, evalFns[i],  highlighter));
}