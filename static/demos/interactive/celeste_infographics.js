let scn = msc.scene();

// let title = scn.mark("text", { text: "Data is the new oil", x : 50, y : 18, fontSize: 46, fontWeight: "bold", anchor: ["left", "top"], "fillColor": "#003333" }),
// subTitle1 = scn.mark("text", { text: "Just like oil, data is a valuable resource that must be", x : 50, y : 75, fontSize: 20, fontWeight: "bold", anchor: ["left", "top"], "fillColor": "#003333" }),
// subTitle2 = scn.mark("text", { text: "extracted, refined, transported, and distributed securely.", x : 50, y : 100, fontSize: 20, fontWeight: "bold", anchor: ["left", "top"], "fillColor": "#003333" });

// let cmpnt = scn.mark("image"),
//     size = 100,
//     parts = [
//         {id: "raw", y: 200, width: size, height: size, label: "Raw Data"},
//         {id: "pipe1", y: 250, width: 169, height: 15, label: ""},
//         {id: "storage", y: 200, width: size, height: size, label: "Storage"},
//         {id: "pipe2", y: 250, width: 113, height: 15, label: ""},
//         {id: "refinery", y: 200, width: size, height: size, label: "Refinery"},
//         {id: "pipe3", y: 168, width: 261, height: 38, label: ""},
//         {id: "pipe4", y: 292, width: 261, height: 38, label: ""},
//         {id: "consumer1", y: 118, width: size, height: size, label: "Consumer"},
//         {id: "consumer2", y: 272, width: size, height: size, label: "Consumer"}
//     ],
//     partsTbl = msc.table(parts);
// let cmpnts = msc.repeat(cmpnt, partsTbl);
// let x = 50;
// for (let [i, c] of cmpnts.children.entries()) {
//     msc.update(c, {
//         x: x,
//         y: parts[i].y,
//         width: parts[i].width,
//         height: parts[i].height,
//         src: "/demos/img/celeste/" + parts[i].id + ".png"
//     }, true);
    
//     if (i === 4)
//         x = x + 40;
//     else if (i === 5 || i === 7)
//         x += 0
//     else if (i === 6)
//         x += 261
//     else
//         x += parts[i].width;
// }

let t1 = scn.mark("text", { text: "Business Flows", x : 470, y : 10, fontSize: 26, fontWeight: "bold", anchor: ["left", "top"], "fillColor": "#003333" });
// let t2 = scn.mark("text", { text: "Hover over each scenario to see the corresponding business flow", x : 210, y : 30, fontSize: 20, anchor: ["left", "top"], "fillColor": "#003333" })

let cmpnt = scn.mark("image"),
    size = 100,
    parts = [
        {id: "patientData", "src": "patientData.jpg", x: 120, y: 110, width: size, height: size, label: "Patient / Medical Services Data"},
        {id: "portal", "src": "portal.jpg", x: 370, y: 220, width: size, height: size, label: "Web Portal"},
        //{id: "pipe2", y: 250, width: 113, height: 15, label: ""},
        {id: "dataStorage", "src": "dataStorage.png", x: 620, y: 110, width: size, height: size, label: "Data Storage"},
        //{id: "pipe3", y: 168, width: 261, height: 38, label: ""},
        //{id: "pipe4", y: 292, width: 261, height: 38, label: ""},
        {id: "dataServices", "src": "dataServices.png", x: 620, y: 310, width: size, height: size, label: "Data Services"},
        {id: "patientPC", "src": "patientPC.png", x: 110, y: 310, width: size, height: size, label: "Patient's PC"},
        {id: "creditCardservices", "src": "creditCardservices.png", x: 870, y: 210, width: size, height: size, label: "Credit Card Services"},
    ],
    partsTbl = msc.table(parts);
let cmpnts = msc.repeat(cmpnt, partsTbl);
for (let [i, c] of cmpnts.children.entries()) {
    msc.update(c, {
        x: parts[i].x,
        y: parts[i].y,
        width: parts[i].width,
        height: parts[i].height,
        src: "/demos/img/celeste/" + parts[i].src
    }, true);
}

let link = scn.mark("image", {opacity: 0.1}),
    linkInfo = [
        {id: "a1", "src": "a1.png", x: 205, y: 135, width: 215, height: 167, label: ""},
        {id: "a2", "src": "a2.png", x: 462, y: 110, width: 210, height: 160, label: ""},
        {id: "a3", "src": "a3.png", x: 628, y: 232, width: 82, height: 82, label: ""},
        {id: "b1", "src": "b1.png", x: 205, y: 230, width: 215, height: 167, label: ""},
        {id: "b2", "src": "b2.png", x: 415, y: 230, width: 210, height: 160, label: ""},
        {id: "b3", "src": "b3.png", x: 628, y: 232, width: 82, height: 82, label: ""},
        {id: "c2", "src": "c2.png", x: 485, y: 255, width: 365, height: 27, label: ""}
    ],
    linkTbl = msc.table(linkInfo);
let links = msc.repeat(link, linkTbl);
for (let [i, c] of links.children.entries()) {
    msc.update(c, {
        x: linkInfo[i].x,
        y: linkInfo[i].y,
        width: linkInfo[i].width,
        height: linkInfo[i].height,
        src: "/demos/img/celeste/" + linkInfo[i].src
    }, true);
}

let node = scn.mark("text", {fontSize: "12.5px", anchor: ["center", "top"], fontWeight: "bold", "backgroundColor": "white", "borderColor": "#eee" });
msc.repeat(node, partsTbl);
msc.encode(node, {channel: "text", attribute: "label"});
msc.affix(node, cmpnt, "x");
msc.affix(node, cmpnt, "y", {elementAnchor: "top", baseAnchor: "bottom", offset: 2});
msc.findElements(scn, [{attribute: "label", value: ""}, {property: "type", value: "text"}]).forEach(d => d.visibility = "hidden");

let flowTbl = msc.table([
    {"id": "upload", "label": "Client uploads data"},
    {"id": "pay", "label": "Patient pays bills"},
    {"id": "download", "label": "Patient downloads reports"},
]);

let scenario = scn.mark("text", { x : 250, y : 60, fontSize: "18px", fontWeight: "bold", anchor: ["center", "top"], "fillColor": "#fff", backgroundColor: "#3399ff" });

let scenarios = msc.repeat(scenario, flowTbl);
scenarios.layout = msc.layout("grid", {numRows: 1, colGap: 270});
msc.encode(scenario, {channel: "text", attribute: "label"});

let t3 = scn.mark("text", { text: "Security Concerns", x : 475, y : 480, fontSize: 26, fontWeight: "bold", anchor: ["left", "top"], "fillColor": "#003333" }),
    t4 = scn.mark("text", { text: "Click on each concern for more details and action items", x : 325, y : 513, fontSize: 20, anchor: ["left", "top"], "fillColor": "#003333" });


let concernTbl = msc.table([
    {"src": "/demos/img/celeste/integrity.png", "id": "integrity", "label": "Data Integrity"},
    {"src": "/demos/img/celeste/confidentiality.png", "id": "confidentiality", "label": "Data Confidentiality"},
    {"src": "/demos/img/celeste/availability.png", "id": "availability", "label": "Data Availability"},
    {"src": "/demos/img/celeste/loss.png", "id": "loss", "label": "Data Loss"},
    {"src": "/demos/img/celeste/performance.png", "id": "performance", "label": "Processing Performance"},
    {"src": "/demos/img/celeste/theft.png", "id": "theft", "label": "Data Theft"}
]);

let concern = scn.mark("image", {x: 70, y: 560, width: 110, height: 110});
let concerns = msc.repeat(concern, concernTbl);
concerns.layout = msc.layout("grid", {numRows: 1, colGap: 65});
msc.encode(concern, {channel: "src", attribute: "src"});

let crnTtl = scn.mark("text", { x : 120, y : 680, fontSize: 18, fontWeight: "bold", anchor: ["center", "top"], "fillColor": "#003333" });
let crnTtls = msc.repeat(crnTtl, concernTbl);
msc.encode(crnTtl, {channel: "text", attribute: "label"});
crnTtls.layout = msc.layout("grid", {numRows: 1, colGap: 175});

let relation = {
    "upload": ["a1", "a2", "a3"],
    "pay": ["b1", "b2", "b3"],
    "download": ["a1", "c2"]
}

let trigger = { event: "hover", type: "element", element: scenario },
    target = { target: link, targetChannels: ["opacity"] },
    match = (trigger, target) => {
        if (!trigger) return false;
        return relation[trigger.dataScope.getAttrVal("id")].includes(target.dataScope.getAttrVal("id")) 
    },
    highlighter = (condMet, trigger, target) => {
        if (condMet) {
            msc.update(target, {
                opacity: 1,
            }, true);
        }
    };
msc.activate(trigger, target, match, highlighter);

// let target2 = { target: node, targetChannels: ["opacity"] };
// msc.activate(trigger, target2, match, highlighter);


let trigger2 = { event: "click", type: "element", element: concern };
msc.activate(trigger2, 
            { target: link, targetChannels: ["visibility"] }, 
            () => true, 
            () => {
                let elem = document.getElementById("popup");
                if (elem.style.visibility === "visible")
                    elem.style.visibility = "hidden"
                else
                    elem.style.visibility = "visible"
            });
