// ---------------- global variables ----------------//

const form = document.getElementById('calculator-form');
const weight = document.getElementById('weight');
const lbs = document.getElementById('unit-lbs');
const kg = document.getElementById('unit-kg');
const reps = document.getElementById('reps');
const rpe = document.getElementById('rpe');
const oneRepMaxElement = document.getElementById('one-rep-max');
const convertBtn = document.getElementById('convert-btn');
let oneRepMax;
let weightUnit;
let unitClickCount = 0;

// enabling bootstrap tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

weight.focus();

// ----------- event listeners ----------------- //

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isFormValid(weight.value, reps.value, rpe.value)) {
        oneRepMax = calculateOneRepMax(weight.value, reps.value, rpe.value);

        weightUnit = lbs.checked ? 'lbs' : 'kg';
        
        oneRepMaxElement.innerText = `${oneRepMax} ${weightUnit} `;

        populateTable(oneRepMax);

        // showing the unit conversion button when there is data
        convertBtn.classList.remove('d-none');

        weight.focus();

        // resetting the click count of the unit conversion button
        unitClickCount = 0;
    }
});

form.addEventListener('reset', (e) => {
    form.reset();
    oneRepMaxElement.innerText = '';
    clearTable();
    // hiding the unit conversion button when there is no data
    convertBtn.classList.add('d-none');
    weight.focus();
    unitClickCount = 0;
});



convertBtn.addEventListener('click', toggleUnitConversion);

// --------------------- functions ------------------------ //

const isWeightValid = (weightValue) => {
    if (weightValue > 0 && weightValue <= 2000) {
        weight.classList.remove('is-invalid');
        return true;
    } else {
        weight.classList.add('is-invalid');
        return false;
    }
}

const isRepsValid = (repsValue) => {
    if (repsValue > 0 && repsValue <= 10) {
        reps.classList.remove('is-invalid');
        return true;
    } else {
        reps.classList.add('is-invalid');
        return false;
    }
}

const isRpeValid = (rpeValue) => {
    if (rpeValue >= 6 && rpeValue <= 10) {
        rpe.classList.remove('is-invalid');
        return true;
    } else {
        rpe.classList.add('is-invalid');
        return false;
    }
}

const isFormValid = (weightValue, repsValue, rpeValue) => {
    let validWeight = isWeightValid(weightValue);
    let validReps =  isRepsValid(repsValue);
    let validRPE = isRpeValid(rpeValue);

    if (validWeight && validReps && validRPE) {
        return true;
    } else {
        return false;
    }
}

// rows start from RPE 6 and go up to RPE 10 in 0.5 steps
// cols start from 1 rep and go up to 10 reps
// values are percentages used in 1RM calculation
const percentageArray = [[86, 84, 81, 79, 76, 74, 71, 68, 65, 63],
                         [88, 85, 82, 80, 77, 75, 72, 69, 67, 64],
                         [89, 86, 84, 81, 79, 76, 74, 71, 68, 65],
                         [91, 88, 85, 82, 80, 77, 75, 72, 69, 67],
                         [92, 89, 86, 84, 81, 79, 76, 74, 71, 68],
                         [94, 91, 88, 85, 82, 80, 77, 75, 72, 69],
                         [96, 92, 89, 86, 84, 81, 79, 76, 74, 71],
                         [98, 94, 91, 88, 85, 82, 80, 77, 75, 72],
                         [100, 96, 92, 89, 86, 84, 81, 79, 76, 74]];



const calculateOneRepMax = (weight, reps, rpe) => {
    // (2 * rpe) - 12 will return the corresponding index in percentage array
    // e.g. (2 * 6) - 12 = 0
    // reps - 1 because reps start at 1
    let oneRepMax = (weight * 100) / percentageArray[(2 * rpe) -12][reps - 1];
    return Math.round(oneRepMax);
}

const calculateWeightUsingOneRepMax = (oneRepMax) => {
    // had to initialize the weightArray to be the same size as percentageArray
    let weightArray =  [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    let weight;

    percentageArray.forEach((rpe, rpeIndex) => {
        rpe.forEach((percentage, repsIndex) => {
            // manipulated one rep max formula to calculate weight for each RPE
            // and rep value. loops iterate through the 2d percentage array to
            // get the percentage value for each RPE and rep 
            weight = (oneRepMax * percentage) / 100;
            // storing the calculated weight in a new 2d array to create a table
            weightArray[rpeIndex][repsIndex] = Math.round(weight);
        });
    });   

    return weightArray;
}

const populateTable = (oneRepMax) => {
    let weightArray = calculateWeightUsingOneRepMax(oneRepMax);
    let tableDataElement;

    for (rpeIndex = 0; rpeIndex < 9; rpeIndex++) {
        for (repsIndex = 1; repsIndex <= 10; repsIndex++) {
            // selecting the <td> element for each index in the weightArray using the unique id's
            tableDataElement = document.getElementById(`rpe-${rpeIndex}-reps-${repsIndex}`);
            // adding the weight at the corresponding indexes to the <td> elements
            tableDataElement.innerText = weightArray[rpeIndex][repsIndex - 1];
        }
    }
}

const clearTable = () => {

    let tableDataElement;

    for (rpeIndex = 0; rpeIndex < 9; rpeIndex++) {
        for (repsIndex = 1; repsIndex <= 10; repsIndex++) {
            tableDataElement = document.getElementById(`rpe-${rpeIndex}-reps-${repsIndex}`);
            tableDataElement.innerText = '';
        }
    }
}

function toggleUnitConversion() {
    // tracking the number of times the button has been clicked to create a toggle function. This gets reset when new values are submitted or the form is cleared.
    unitClickCount++;
    // setting the conversion rate based on the current weight unit
    let conversion = weightUnit === 'lbs' ? 0.453592 : 2.20462; 
    // switching the weight unit
    weightUnit = weightUnit === 'lbs' ? 'kg' : 'lbs';
    // recalculating oneRepMax with conversion rate, then outputting new value and re-populating table with converted values
    // on first and odd numbered clicks, apply the conversion rate, on even numbered clicks, go back to the original weight unit
    if (unitClickCount % 2 !== 0) {
        oneRepMax = Math.round(calculateOneRepMax(weight.value * conversion, reps.value, rpe.value));
        oneRepMaxElement.innerText = `${oneRepMax} ${weightUnit} `;
        populateTable(oneRepMax);
        console.log(oneRepMax)
        console.log(conversion);
    } else {
        oneRepMax = Math.round(calculateOneRepMax(weight.value, reps.value, rpe.value));
        oneRepMaxElement.innerText = `${oneRepMax} ${weightUnit} `;
        populateTable(oneRepMax);
    }
}


