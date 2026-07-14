const slider = document.createElement('input');
slider.type = 'range';
slider.min = '2'; // Minimum value
slider.max = '15'; // Maximum value
slider.value = '8'; // Default value
slider.step = '1';
slider.id = 'my-slider'; // Optional: Set an ID for the slider
slider.style.width = '200px';
slider.style.height = '8px';
slider.style.marginTop = "10px";

let numBinsLabel = document.createElement('span');
numBinsLabel.textContent = "Number of bins (target): ";
let numBinsValue = document.createElement('span');
numBinsValue.textContent = slider.value;
slider.addEventListener('input', () => { numBinsValue.textContent = slider.value; });

let numBinsNote = document.createElement('div');
numBinsNote.textContent = "Actual bin count may differ — the binning algorithm adjusts boundaries to round numbers that fit the data range.";
numBinsNote.style.fontSize = "11px";
numBinsNote.style.color = "#888";
numBinsNote.style.marginTop = "3px";

document.getElementById("ctrlPanel").appendChild(numBinsLabel);
document.getElementById("ctrlPanel").appendChild(numBinsValue);
document.getElementById("ctrlPanel").appendChild(slider);
document.getElementById("ctrlPanel").appendChild(numBinsNote);