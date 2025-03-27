let col = 1,
    incr = 1,
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
    ctx.set("inputValue", col);
    scn.onChange("evtContext", ctx);
    renderer.render(scn);

    if (col < 20) {
        col += incr;
        requestAnimFrame(run);
    } else if (round < 10) {
        round++;
        col = 1;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime) / frameTime.length,
            fr = 1000 / t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();