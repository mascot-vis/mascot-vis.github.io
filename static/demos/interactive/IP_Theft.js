let scn = msc.scene();
let dt = await msc.csv("/datasets/csv/ip_theft.csv");

let timelineY = 60;
let timeline = scn.mark("line", {x1: 500, x2: 500, y1: timelineY, y2: timelineY, strokeWidth: 8, strokeColor: "#eee"});
let line = scn.mark("line", {x1: 55, y1: timelineY, x2: 500, y2: timelineY, strokeColor: "#eee", vxShape: "circle", vxRadius: 6, vxFillColor: "#ddd"});
let coll = msc.repeat(line, dt);
let xEnc = msc.encode(line.vertices[0], { attribute: "start", channel: "x" });
msc.encode(line.vertices[1], { attribute: "end", channel: "x", shareScale: xEnc });
xEnc.rangeExtent = 800;
let vx = coll.children.map(d => d.x);
timeline.x1 = Math.min(...vx);
timeline.x2 = Math.max(...vx);

let dateFormat = d3.timeFormat("%m/%d/%y");

let start = scn.mark("circle", {radius: 8, x: line.x1, y: line.y1, fillColor: "orange", strokeWidth: 0}),
    end = scn.mark("circle", {radius: 8, x: line.x2, y: line.y2, fillColor: "orange", strokeWidth: 0}),
    xSpan = scn.mark("line", {x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2, strokeWidth: 8, strokeColor: "orange"}),
    date = scn.mark("text", { text: dateFormat(line.dataScope.getAttrVal("start")), x : line.x1, y : line.y1 + 15, anchor: ["center", "top"] }),
    explanation = scn.mark("text", { text: line.dataScope.getAttrVal("event"), x : 50, y : 20, fontSize: "20px", anchor: ["left", "top"] });
//let current = scn.mark("line", {x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2, strokeWidth: 8, strokeColor: "orange", vxShape: "circle", vxRadius: 6, vxFillColor: "orange"});

let tiLines = [];
for (let i = 0; i < 6; i++) 
    tiLines.push( scn.mark("line", { strokeColor : "blue" }) );

let attacker = scn.mark("image", {src: "/demos/img/cyberSecurity/attacker.png", x: 700, y: 350, width: 125, height: 125}),
    tix = 175, tiy = 200,
    server1_TI = scn.mark("image", {src: "/demos/img/cyberSecurity/server2.jpg", x: tix + 25, y: tiy - 100, width: 50, height: 100}),
    server2_TI = scn.mark("image", {src: "/demos/img/cyberSecurity/server2.jpg", x: tix + 25, y: tiy + 90, width: 50, height: 100}),
    ws1_TI = scn.mark("image", {src: "/demos/img/cyberSecurity/workstation2.png", x: tix + 125, y: tiy + 20, width: 60 , height: 60}),
    ws2_TI = scn.mark("image", {src: "/demos/img/cyberSecurity/workstation2.png", x: tix - 75, y: tiy + 20, width: 60 , height: 60}),
    logo_TI = scn.mark("image", {src: "/demos/img/cyberSecurity/TechInnovate.png", x: tix, y: tiy, width: 100 , height: 100}),
    tiGroup = scn.glyph(server1_TI, server2_TI, ws1_TI, ws2_TI, logo_TI);

let tiIdx = 0, tiMachines = [server1_TI, server2_TI, ws1_TI, ws2_TI];
for (let i = 0; i < tiMachines.length; i++) {
    for (let j = i + 1; j < tiMachines.length; j++) {
        tiLines[tiIdx].x1 = tiMachines[i].bounds.x;
        tiLines[tiIdx].y1 = tiMachines[i].bounds.y;
        tiLines[tiIdx].x2 = tiMachines[j].bounds.x;
        tiLines[tiIdx].y2 = tiMachines[j].bounds.y;
        tiIdx++; 
        //scn.mark("line", {x1: scGroup.children[i].bounds.x, y1: scGroup.children[i].bounds.y, x2: scGroup.children[j].bounds.x, y2: scGroup.children[j].bounds.y, strokeColor: "blue" });
    }
}

let scLines = [];
for (let i = 0; i < 6; i++) 
    scLines.push( scn.mark("line", { strokeColor : "blue" }) );

let scx = 175, scy = 510,
    server1_SC = scn.mark("image", {src: "/demos/img/cyberSecurity/server2.jpg", x: scx + 25, y: scy - 90, width: 50, height: 100}),
    server2_SC = scn.mark("image", {src: "/demos/img/cyberSecurity/server2.jpg", x: scx + 25, y: scy + 80, width: 50, height: 100}),
    ws1_SC = scn.mark("image", {src: "/demos/img/cyberSecurity/workstation2.png", x: scx + 125, y: scy + 20, width: 60 , height: 60}),
    ws2_SC = scn.mark("image", {src: "/demos/img/cyberSecurity/workstation2.png", x: scx - 75, y: scy + 20, width: 60 , height: 60}),
    logo_SC = scn.mark("image", {src: "/demos/img/cyberSecurity/subcontractor.png", x: scx, y: scy, width: 100 , height: 100});

let scIdx = 0, scMachines = [server1_SC, server2_SC, ws1_SC, ws2_SC];
for (let i = 0; i < scMachines.length; i++) {
    for (let j = i + 1; j < scMachines.length; j++) {
        scLines[scIdx].x1 = scMachines[i].bounds.x;
        scLines[scIdx].y1 = scMachines[i].bounds.y;
        scLines[scIdx].x2 = scMachines[j].bounds.x;
        scLines[scIdx].y2 = scMachines[j].bounds.y;
        scIdx++; 
        //scn.mark("line", {x1: scGroup.children[i].bounds.x, y1: scGroup.children[i].bounds.y, x2: scGroup.children[j].bounds.x, y2: scGroup.children[j].bounds.y, strokeColor: "blue" });
    }
}

let scGroup = scn.glyph(server1_SC, server2_SC, ws1_SC, ws2_SC, logo_SC);

let probe = scn.mark("image", {src: "/demos/img/cyberSecurity/probe.png", x: 400, y: 400, width: 370 , height: 300, opacity: 0});
let redMask = scn.mark("image", {src: "/demos/img/cyberSecurity/redMask.png", x: 160, y: 400, width: 135 , height: 135, opacity: 0});
let infiltrate = scn.mark("image", {src: "/demos/img/cyberSecurity/infiltrate.png", x: 250, y: 380, width: 450 , height: 135, opacity: 0});
let sniff = scn.mark("image", {src: "/demos/img/cyberSecurity/sniff.png", x: 250, y: 380, width: 450 , height: 135, opacity: 0});
let sniffMask = scn.mark("image", {src: "/demos/img/cyberSecurity/sniffMask.png", x: 160, y: 400, width: 135 , height: 135, opacity: 0});
let seeWeaknesses = scn.mark("image", {src: "/demos/img/cyberSecurity/seeWeaknesses.png", x: 400, y: 500, width: 450 , height: 135, opacity: 0});

let email = scn.mark("image", {src: "/demos/img/cyberSecurity/discoverEmail.png", x: 250, y: 380, width: 450 , height: 135, opacity: 0}),
    sender = scn.mark("text", { text: "Sender", x : 370, y : 560, fontSize: "16px", fontWeight: "bold", anchor: ["left", "middle"], opacity: 0, fillColor: "#3399cc"}),
    receiver = scn.mark("text", { text: "Recipient", x : 370, y : 250, fontSize: "16px", fontWeight: "bold", anchor: ["left", "middle"], opacity: 0, fillColor: "#3399cc" }),
    emailPath = scn.mark("image", {src: "/demos/img/cyberSecurity/emailPath.png", x: -35, y: 277, width: 600 , height: 255, opacity: 0}),
    emailDiscover = scn.glyph(email, sender, receiver, emailPath);

let stopProbe = scn.mark("image", {src: "/demos/img/cyberSecurity/stop.png", x: 435, y: 100, width: 330 , height: 230, opacity: 0});
let seeStopped = scn.mark("image", {src: "/demos/img/cyberSecurity/seeStopped.png", x: 400, y: 500, width: 450 , height: 135, opacity: 0});
let sendEmail = scn.mark("image", {src: "/demos/img/cyberSecurity/sendEmail.png", x: 250, y: 380, width: 450 , height: 135, opacity: 0});
let phishingEmail =  scn.mark("image", {src: "/demos/img/cyberSecurity/phishing_email.jpg", x: 650, y: 400, width: 60 , height: 60, opacity: 0}),
    openEmail =  scn.mark("image", {src: "/demos/img/cyberSecurity/email_opened.jpg", x: 360, y: 255, width: 60 , height: 60, opacity: 0});

let redMask2 = scn.mark("image", {src: "/demos/img/cyberSecurity/redMask.png", x: 260, y: 180, width: 135 , height: 135, opacity: 0}),
    trojan = scn.mark("text", { text: "Remote access Trojan installed", x : 420, y : 200, fontSize: "16px", fontWeight: "bold", fillColor: "red", opacity: 0 });

let channel = scn.mark("image", {src: "/demos/img/cyberSecurity/channel.png", x: -35, y: 277, width: 600 , height: 155, opacity: 0}),
    establishChannel = scn.mark("image", {src: "/demos/img/cyberSecurity/establishChannel.png", x: 250, y: 380, width: 450 , height: 135, opacity: 0});
let seeEstablishChannel = scn.mark("image", {src: "/demos/img/cyberSecurity/seeEstablishChannel.png", x: 400, y: 500, width: 450 , height: 135, opacity: 0});

let nwMask = scn.mark("image", {src: "/demos/img/cyberSecurity/networkMask.png", x: 60, y: 85, width: 320 , height: 320, opacity: 0});
let redMask3 = scn.mark("image", {src: "/demos/img/cyberSecurity/redMask.png", x: 60, y: 180, width: 135 , height: 135, opacity: 0});
let seeGainAccess = scn.mark("image", {src: "/demos/img/cyberSecurity/seeGainAccess.png", x: 400, y: 500, width: 450 , height: 135, opacity: 0});
let seeInternalRecon = scn.mark("image", {src: "/demos/img/cyberSecurity/seeInternalRecon.png", x: 400, y: 500, width: 450 , height: 135, opacity: 0});

let algo = scn.mark("image", {src: "/demos/img/cyberSecurity/algo.png", x: 40, y: 220, width: 50 , height: 50, opacity: 0}),
    algoText = scn.mark("text", { text: "AI algorithm", x : 25, y : 210, fontSize: "16px", fontWeight: "bold", anchor: ["left", "middle"], opacity: 0, fillColor: "#3399cc"});

let exfiltrate = scn.mark("image", {src: "/demos/img/cyberSecurity/exfiltrate.png", x: -35, y: 220, width: 520 , height: 255, opacity: 0 });
let seeTransfer = scn.mark("image", {src: "/demos/img/cyberSecurity/seeTransfer.png", x: 400, y: 500, width: 450 , height: 135, opacity: 0});

let algo2 = scn.mark("image", {src: "/demos/img/cyberSecurity/algo.png", x: 825, y: 420, width: 50 , height: 50, opacity: 0}),
    algoText2 = scn.mark("text", { text: "AI algorithm", x : 810, y : 410, fontSize: "16px", fontWeight: "bold", anchor: ["left", "middle"], opacity: 0, fillColor: "#3399cc"});

let frames = [
    [{ elem: probe, styles: { opacity : 1.0 }}],
    [{ elem: probe, styles: { opacity : 0.0 }}, { elem: [infiltrate, redMask, seeWeaknesses], styles: { opacity : 1.0 }} ],
    [{ elem: [infiltrate,seeWeaknesses], styles: { opacity : 0.0 }}, { elem: [sniff, sniffMask], styles: { opacity : 1.0 }} ],
    [{ elem: [sniffMask, sniff], styles: { opacity : 0.0 }}, { elem: emailDiscover, styles: { opacity : 1.0 } }],
    [{ elem: email, styles: { opacity : 0.0 } }, { elem: [stopProbe, seeStopped], styles: { opacity : 1.0 } }],
    [ { elem: [stopProbe, seeStopped], styles: { opacity : 0.0 } },  { elem: [sendEmail, phishingEmail], styles: { opacity : 1.0 } } ],
    [ { elem: phishingEmail, styles: { x : 250 } } ],
    [ { elem: phishingEmail, styles: { x : 250, y: 330 } } ],
    [ { elem: phishingEmail, styles: { x : 360, y: 260 } } ],
    [ { elem: phishingEmail, styles: { opacity: 0  } }, { elem: [openEmail, redMask2, trojan], styles: { opacity: 1  } } ],
    [ { elem: [openEmail,trojan, sendEmail, emailPath, sender, receiver], styles: { opacity: 0  } }, { elem: [channel, establishChannel, seeEstablishChannel], styles: { opacity: 1  } } ],
    [ { elem: tiLines, styles: { strokeColor: "red"  }}, { elem: [nwMask, seeInternalRecon], styles: { opacity: 1  }}, { elem: seeEstablishChannel, styles: { opacity: 0  }}],
    [ { elem: [seeInternalRecon], styles: { opacity : 0  }}, { elem: [algo, algoText, seeGainAccess, redMask3], styles: { opacity : 1  }}],
    [ { elem: [channel, seeGainAccess], styles: { opacity : 0  }}, { elem: [exfiltrate, algo2, algoText2, seeTransfer], styles: { opacity : 1  }}]
]

let idx = 1;
let inputTrigger = { event:"input", type: "keyboard", key: "ArrowRight" },
    callback = () => {
        if (idx > coll.children.length - 1) return;
        //timeline
        let c = coll.children[idx];
        xSpan.x1 = c.x1;
        xSpan.x2 = c.x2;
        xSpan.y1 = c.y1;
        xSpan.y2 = c.y2;
        date._text = dateFormat(c.dataScope.getAttrVal("start"));
        date._x = (c.x1 + c.x2)/2;
        date._y = c.y1 + 15;
        explanation._text = c.dataScope.getAttrVal("event");
        msc.update(start, { x: c.x1, y: c.y1 }, true);
        msc.update(end, { x: c.x2, y: c.y2 }, true);

        //main scene
        let elems = frames[idx - 1];
        for (let e of elems) {
            if (Array.isArray(e.elem)) {
                for (let c of e.elem)
                    msc.update(c, e.styles, true);
            } else
                msc.update(e.elem, e.styles, true);
        }
        idx++;
    }
msc.activate(inputTrigger, {}, undefined, callback, {duration: 750});