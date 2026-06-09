const spinner = document.createElement('input');
spinner.type = 'number';
spinner.min = '1';
spinner.max = '20';
spinner.value = '10';
spinner.step = '1';
spinner.id = 'my-spinner';
spinner.style.width = '40px';
spinner.style.height = '20px';
spinner.style.marginTop = "3px";
spinner.style.marginBottom = "20px";


const attrs = document.createElement('select');
let corners = ["top left", "top right", "bottom left", "bottom right"];
corners.forEach(option => {
    const opt = document.createElement('option');
    let temp = option.split(" ");
    opt.value = temp[0] + temp[1][0].toUpperCase() + temp[1].substring(1)
    opt.textContent = option;
    if (option === "topLeft") {
        opt.selected = true;
    }
    attrs.appendChild(opt);
});

attrs.id = 'start-from'; // Optional: Set an ID for the slider
attrs.style.width = '160px';
attrs.style.height = '20px';
attrs.style.marginTop = "3px";
attrs.style.marginBottom = "20px";


let numCols = document.createElement('div');
numCols.textContent = "Number of Columns";
document.getElementById("ctrlPanel").appendChild(numCols);
document.getElementById("ctrlPanel").appendChild(spinner);

let start = document.createElement('div');
start.textContent = "Start from";
document.getElementById("ctrlPanel").appendChild(start);
document.getElementById("ctrlPanel").appendChild(attrs);

const dir = document.createElement('select');
let dirs = ["row first", "column first"];
dirs.forEach(option => {
    const opt = document.createElement('option');
    let temp = option.split(" ");
    opt.value = temp[0] + temp[1][0].toUpperCase() + temp[1].substring(1)
    opt.textContent = option;
    if (option === "row first") {
        opt.selected = true;
    }
    dir.appendChild(opt);
});

dir.id = 'dir'; // Optional: Set an ID for the slider
dir.style.width = '160px';
dir.style.height = '20px';
dir.style.marginTop = "3px";

let direction = document.createElement('div');
direction.textContent = "Direction";
document.getElementById("ctrlPanel").appendChild(direction);
document.getElementById("ctrlPanel").appendChild(dir);