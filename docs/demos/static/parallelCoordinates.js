let scn = msc.scene();
let xPos = [100, 350, 600, 850], top = 80;
let path = scn.mark("path", {
	vertices: [[xPos[0], top], [xPos[1], top], [xPos[2], top], [xPos[3], top]],
	strokeColor: "#95D0F5",
	opacity: 0.15
} );
let dt = await msc.csv("datasets/csv/cars.csv");

let paths = scn.repeat(path, dt);
let fields = ["cylinders", "economy(mpg)", "displacement(cc)", "power(hp)"];
for (let i = 0; i < fields.length; i++)
	scn.encode(path.vertices[i], {field: fields[i], channel: "y", rangeExtent: 400});
let enc = scn.encode(path, {field: "cylinders", channel: "strokeColor", scheme: "interpolateBuPu"});
scn.legend("strokeColor", "cylinders", {x: 950, y: 100});
// scn.encode(path, {field: "year", channel: "strokeColor"});
// scn.legend("strokeColor", "year", {x: 950, y: 100});
for (let i = 0; i < fields.length; i++)
	scn.axis("y", fields[i], {orientation: "left", pathX: xPos[i], titleAnchor: ["center", "top"], rotateTitle: false, titlePosition: [xPos[i], top - 20]});	