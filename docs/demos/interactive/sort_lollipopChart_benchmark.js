let round = 0;

let t1, t2;
let frameTime = [];
let run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tg2.eventContext;
    let dir = ctx.get("inputValue");
    ctx.set("inputValue", dir === "descending" ? "ascending" : "descending");
    scn.onChange("evtContext", ctx);
    renderer.render(scn);

    if (round < 50) {
        round++;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime) / frameTime.length,
            fr = 1000 / t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();