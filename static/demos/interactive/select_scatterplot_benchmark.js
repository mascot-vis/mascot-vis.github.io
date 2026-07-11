let continents = dt.unique("Continent"),
    elems = continents.map(d => msc.findElements(scene, [{attribute: "Continent", value: d}, {property: "type", value: "circle"}])[0]),
    count = 0,
    round = 0;
let t1, t2;
let frameTime = [];
let run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tg1.eventContext;
    let elem = elems[count];
    if (!elem) {
        ctx.set("element", undefined);
        ctx.set("elements", []);
    } else {
        ctx.set("element", elem);
        ctx.set("elements", ctx.get("elements").concat([elem]));
    }
    scn.onChange("evtContext", ctx);
    renderer.render(scn);

    if (count < continents.length) {
        count++;
        requestAnimFrame(run);
    } else if (round < 10) {
        round++;
        count = 0;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime)/frameTime.length,
            fr = 1000/t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();