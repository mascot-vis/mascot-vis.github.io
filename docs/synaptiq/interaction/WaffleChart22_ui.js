const link = document.createElement("a");
link.href = "https://observablehq.com/@hrbrmstr/observable-plot-waffle-wafflemark";
link.textContent = "Original Visualization (Made using Observable Plot)";
link.style.marginBottom = "15px";
link.style.display = "block";
link.target = "_blank";
document.getElementById("ctrlPanel").appendChild(link);

const info = document.createElement('div');
info.innerText = "Use the spinner below to change the number of rows.";
info.style.marginBottom = "20px";
document.getElementById("ctrlPanel").appendChild(info);

const spinner = document.createElement('input');
spinner.type = 'number';
spinner.min = 1;
spinner.max = 80;
spinner.value = 11;
spinner.step = 1;
spinner.id = 'my-spinner';
spinner.style.width = '40px';
spinner.style.height = '20px';
spinner.style.marginTop = "3px";
spinner.style.marginBottom = "20px";


let numCols = document.createElement('div');
numCols.textContent = "Number of Rows";
document.getElementById("ctrlPanel").appendChild(numCols);
document.getElementById("ctrlPanel").appendChild(spinner);


const dir = document.createElement('select');
let dirs = ["row first", "column first"];
dirs.forEach(option => {
    const opt = document.createElement('option');
    let temp = option.split(" ");
    opt.value = temp[0] + temp[1][0].toUpperCase() + temp[1].substring(1)
    opt.textContent = option;
    if (option === "column first") {
        opt.selected = true;
    }
    dir.appendChild(opt);
});