const link = document.createElement("a");
link.href = "https://dataviz.unhcr.org/tutorials/r/change-over-time/#dotplot";
link.textContent = "Original Visualization (Made using ggplot)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);

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
let list = ["row index", "location", "before_covid", "first_months"];
list.forEach(option => {
    const opt = document.createElement('option');
    //let temp = option.split(" ");
    opt.value = option === "row index" ? "mascot_rowId" : option; // temp[0] + temp[1][0].toUpperCase() + temp[1].substring(1)
    opt.textContent = option;
    if (option === "row index") {
        opt.selected = true;
    }
    attrs.appendChild(opt);
});

attrs.id = 'attr'; // Optional: Set an ID for the slider
attrs.style.width = '160px';
attrs.style.height = '20px';
attrs.style.marginTop = "3px";
attrs.style.marginBottom = "20px";


let attrTxt = document.createElement('div');
attrTxt.textContent = "Sort the glyphs by";
document.getElementById("ctrlPanel").appendChild(attrTxt);
document.getElementById("ctrlPanel").appendChild(attrs);


const dir = document.createElement('select');
let dirs = ["ascending", "descending"];
dirs.forEach(option => {
    const opt = document.createElement('option');
    //let temp = option.split(" ");
    opt.value = option; // temp[0] + temp[1][0].toUpperCase() + temp[1].substring(1)
    opt.textContent = option;
    if (option === "ascending") {
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