let scn = msc.scene();
let xPos = [100, 350, 600, 850], top = 80;
let path = scn.mark("path", {
	vertices: [[xPos[0], top], [xPos[1], top], [xPos[2], top], [xPos[3], top]],
	strokeColor: "#95D0F5",
	opacity: 0.15
} );
let dt = await msc.csv("/datasets/csv/cars.csv");

let paths = scn.repeat(path, dt);
let attributes = ["cylinders", "economy(mpg)", "displacement(cc)", "power(hp)"];
for (let i = 0; i < attributes.length; i++)
	scn.encode(path.vertices[i], {attribute: attributes[i], channel: "y", rangeExtent: 400});
let enc = scn.encode(path, {attribute: "cylinders", channel: "strokeColor", scheme: "interpolateBuPu"});
scn.legend("strokeColor", "cylinders", {x: 950, y: 100});
// scn.encode(path, {attribute: "year", channel: "strokeColor"});
// scn.legend("strokeColor", "year", {x: 950, y: 100});
for (let i = 0; i < attributes.length; i++)
	scn.axis("y", attributes[i], {orientation: "left", pathX: xPos[i], rotateTitle: false, titleOffset: 0});	
//, titleAnchor: ["center", "top"],  titlePosition: [xPos[i], top - 20]