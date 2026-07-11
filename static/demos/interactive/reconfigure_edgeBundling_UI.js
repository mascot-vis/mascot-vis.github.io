const slider = document.createElement('input');
slider.type = 'range';
slider.min = '0'; // Minimum value
slider.max = '1'; // Maximum value
slider.value = '0'; // Default value
slider.step = '0.05';
slider.id = 'my-slider'; // Optional: Set an ID for the slider
slider.style.width = '200px';
slider.style.height = '8px';
slider.style.marginTop = "10px";

let numCols = document.createElement('span');
numCols.textContent = "Bundle Strength";
document.getElementById("ctrlPanel").appendChild(numCols);
document.getElementById("ctrlPanel").appendChild(slider);