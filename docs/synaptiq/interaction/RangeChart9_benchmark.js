let xRange = [50, 600], incr = 25, count = 0;
let x = xRange[0];
let t1, t2;
let frameTime = [];

let run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    if (x > xRange[1]) {
        incr = -25;
    } else if (x < xRange[0]) {
        incr = 25;
    }
    x += incr;
    let ctx = tg.eventContext;
    ctx.set("dx", incr);
    scn.onChange("evtContext", ctx);
    renderer.render(scn);

    if (count < 200) {
        count++;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime)/frameTime.length,
            fr = 1000/t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();