let scn = msc.scene();
let line = scn.mark("line", {x1: 120, y1: 80, x2: 820, y2: 550, strokeColor: "gray", vxShape: "circle", vxRadius: 3, vxStrokeColor: "white", vxStrokeWidth: 1} );
let dt = await msc.csv("/datasets/csv/caltrain.csv");

msc.repeat(line, dt, {attribute: "Train"});
let path = msc.densify(line, dt, {attribute: "Station"});

let xEnc = msc.encode(path.firstVertex, {attribute: "Time", channel: "x"});
xEnc.rangeExtent = 700;

let yEnc = msc.encode(path.firstVertex, {attribute: "Station", channel: "y"});
yEnc.domain = ["Gilroy", "San Martin", "Morgan Hill", "Blossom Hill", "Capitol", "Tamien", "San Jose", "College Park", "Santa Clara", "Lawrence", "Sunnyvale", "Mountain View",  "San Antonio", "California Ave", "Palo Alto", "Menlo Park", "Redwood City", "San Carlos", "Belmont", "Hillsdale", "Hayward Park", "San Mateo", "Burlingame", "Millbrae", "San Bruno", "So. San Francisco", "Bayshore", "22nd Street", "San Francisco"];

msc.sortChildren(path, "x");

msc.encode(path, {attribute: "Direction", channel: "strokeColor"});

scn.axis("y", "Station", {orientation: "left", titleVisible: false, titlePosition: [95, 60]}); //, titleAnchor: ["right", "top"]
scn.axis("x", "Time", {orientation: "bottom"});
scn.legend("strokeColor", "Direction", {x: 860, y: 100});
scn.gridlines("y", "Station");