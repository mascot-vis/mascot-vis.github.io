const link = document.createElement("a");
link.href = "https://observablehq.com/@mahog/vega-lite-tutorial-part-1-lets-make-a-scatterplot-solution";
link.textContent = "Original Visualization (Made using Vega-Lite)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);

const info = document.createElement('div');
info.innerText = "Use the dropdown menus below to change the attributes for the x- and y- axis.";
info.style.marginBottom = "20px";
document.getElementById("ctrlPanel").appendChild(info);

const xAttrs = document.createElement('select'),
    yAttrs = document.createElement('select');
let attrs = ["Miles_per_Gallon","Cylinders","Displacement","Horsepower","Weight_in_lbs","Acceleration","Year"];
attrs.forEach(option => {
    addOption(option, xAttrs, "x");
    addOption(option, yAttrs, "y");
});

xAttrs.id = 'x-attr'; // Optional: Set an ID for the slider
xAttrs.style.width = '160px';
xAttrs.style.marginTop = "3px";
yAttrs.id = 'y-attr'; // Optional: Set an ID for the slider
yAttrs.style.width = '160px';
yAttrs.style.marginTop = "3px";

function addOption(option, ctrl, axis) {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    if (option === "Horsepower"  && axis === "x") {
        opt.selected = true;
    } else if (option === "Miles_per_Gallon"  && axis === "y") {
        opt.selected = true;
    }
    ctrl.appendChild(opt);
}

let numCols = document.createElement('span');
numCols.textContent = "x-axis";
numCols.style.margin = "0 0 0px 0px";
numCols.style.display = "block";
document.getElementById("ctrlPanel").appendChild(numCols);
document.getElementById("ctrlPanel").appendChild(xAttrs);

let ySpan = document.createElement('span');
ySpan.textContent = "y-axis";
ySpan.style.margin = "15px 0 0px 0px";
ySpan.style.display = "block";
document.getElementById("ctrlPanel").appendChild(ySpan);
document.getElementById("ctrlPanel").appendChild(yAttrs);