const xAttrs = document.createElement('select'),
    yAttrs = document.createElement('select');
let attrs = ["GDP per capita", "Life expectancy", "Population"];
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
    if (option === "GDP per capita"  && axis === "x") {
        opt.selected = true;
    } else if (option === "Life expectancy"  && axis === "y") {
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