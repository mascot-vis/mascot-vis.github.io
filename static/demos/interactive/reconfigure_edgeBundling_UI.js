const spinner = document.createElement('input');
spinner.type = 'range';
spinner.min = '0'; // Minimum value
spinner.max = '1'; // Maximum value
spinner.value = '0'; // Default value
spinner.step = '0.05';
spinner.id = 'my-slider'; // Optional: Set an ID for the slider
spinner.style.width = '200px';
spinner.style.height = '8px';
spinner.style.marginTop = "10px";

let numCols = document.createElement('span');
numCols.textContent = "Bundle Strength";
document.getElementById("ctrlPanel").appendChild(numCols);
document.getElementById("ctrlPanel").appendChild(spinner);