let xRange = [100, 550], yRange = [50, 550], round = 0, xExt = 10, yExt = 10;
let x = xRange[0], y = yRange[0];
let t1, t2;
let frameTime = [];

let run = function () {
    t1 = Date.now();
    if (t2) {
        frameTime.push(t1 - t2);
    }
    t2 = Date.now();

    let ctx = tg1.eventContext;
    ctx.set("xInterval", [x, x + xExt]);
    ctx.set("yInterval", [y, y + yExt]);
    scn.onChange("evtContext", ctx);
    renderer.render(scn);

    if (x + xExt < xRange[1]) {
        xExt += 5;
        requestAnimFrame(run);
    } else if (y + yExt < yRange[1]) {
        yExt += 5;
        requestAnimFrame(run);
    } else if (round < 5) {
        x = xRange[0];
        y = yRange[0];
        xExt = 5;
        yExt = 5;
        round++;
        requestAnimFrame(run);
    } else {
        let t = d3.sum(frameTime)/frameTime.length,
            fr = 1000/t;
        alert("average time to update a frame: " + t.toFixed(2) + " ms; frame rate: " + fr.toFixed(0));
    }
}
run();