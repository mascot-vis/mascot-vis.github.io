let xRange = [51, 500], round = 0;
let x = xRange[0];
let t1, t2;
let frameTime = [];

let run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tg.eventContext;
    ctx.set("x", x);
    scn.onChange("evtContext", ctx);
    renderer.render(scn);

    if (x < xRange[1]) {
        x += 15;
        requestAnimFrame(run);
    } else if (round < 3) {
        x = xRange[0];
        round++;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime)/frameTime.length,
            fr = 1000/t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();