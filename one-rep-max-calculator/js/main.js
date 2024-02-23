// ---------------- global variables ----------------//

const calculatorForm = document.getElementById('calculator-form');
const weight = document.getElementById('weight');
const lbsBtn = document.getElementById('unit-lbs');
const kgBtn = document.getElementById('unit-kg');
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



// ----------- event listeners ----------------- //

calculatorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isFormValid(weight.value, reps.value, rpe.value)) {
        oneRepMax = calculateOneRepMax(weight.value, reps.value, rpe.value);

        weightUnit = lbsBtn.checked ? 'lbs' : 'kg';
        
        oneRepMaxElement.innerText = `${oneRepMax} ${weightUnit} `;

        populateTable(oneRepMax);

        // showing the unit conversion button when there is data
        convertBtn.classList.remove('d-none');

        // resetting the click count of the unit conversion button
        unitClickCount = 0;
    }
});

// notifying user if inputs are invalid when inputs lose focus
weight.addEventListener('focusout', () => {
    isWeightValid(weight.value);
});

reps.addEventListener('focusout', () => {
    isRepsValid(reps.value);
});

rpe.addEventListener('focusout', () => {
    isRpeValid(rpe.value);
});

calculatorForm.addEventListener('reset', (e) => {
    calculatorForm.reset();
    oneRepMaxElement.innerText = '';
    clearTable();
    // hiding the unit conversion button when there is no data
    convertBtn.classList.add('d-none');
    unitClickCount = 0;
    weight.classList.remove('is-invalid');
    reps.classList.remove('is-invalid');
    rpe.classList.remove('is-invalid');
});



convertBtn.addEventListener('click', toggleUnitConversion);

// --------------------- functions ------------------------ //

/* This function accepts the value of the weight input as a parameter
 and checks to see if it is within the allowed range. It must be greater
 than 0, and less than 2000. I set min and max on the number inputs, but
 it does not prevent the user from typing values out of range. If the value
 is out of range, false is returned, and the bootstrap is-invalid class is added 
 which displays a message to the user. Returns true if value is in range and
 removes the is-invalid class */
const isWeightValid = (weightValue) => {
    if (weightValue > 0 && weightValue <= 2000) {
        weight.classList.remove('is-invalid');
        return true;
    } else {
        weight.classList.add('is-invalid');
        return false;
    }
}

/* Functionally identical to isWeightValid, but with a different maximum and also checks if the value is an integer. Max is 10 reps because there is no %1RM data to do the calculation above 10 reps */
const isRepsValid = (repsValue) => {
    if (repsValue > 0 && repsValue <= 10 && Number.isInteger(Number(repsValue))) {
        reps.classList.remove('is-invalid');
        return true;
    } else {
        reps.classList.add('is-invalid');
        return false;
    }
}

/* Min is 6 and max is 10 because there is no %1RM data below RPE 6,
 and RPE scale goes up to 10. Checks to see if value is an increment of 0.5 by checking if rpeValue * 2 is an integer. */
const isRpeValid = (rpeValue) => {
    if (rpeValue >= 6 && rpeValue <= 10 && Number.isInteger(Number(rpeValue * 2))) {
        rpe.classList.remove('is-invalid');
        return true;
    } else {
        rpe.classList.add('is-invalid');
        return false;
    }
}

/* This function acceps the values of the weight, reps, and RPE inputs
 and uses the above functions to validate all inputs at once. If all inputs are
 valid, true is returned. If any input is invalid, false is returned. This is used to allow or prevent form submission. */
const isFormValid = (weightValue, repsValue, rpeValue) => {
    let validWeight = isWeightValid(weightValue);
    let validReps =  isRepsValid(repsValue);
    let validRPE = isRpeValid(rpeValue);

    return validWeight && validReps && validRPE
}

/* This array contains percentage of one-rep max data needed
 to calculate the weight the user can lift at different RPE and
 rep targets 
    rows start from RPE 6 and go up to RPE 10 in 0.5 steps
    cols start from 1 rep and go up to 10 reps
    eg. percentageArray[0][0] represents RPE 6 for 1 rep which is 86% of 1-rep max
    table data sourced from https://fiftyonestrong.com/rpe/ */
const percentageArray = [[86, 84, 81, 79, 76, 74, 71, 68, 65, 63],
                         [88, 85, 82, 80, 77, 75, 72, 69, 67, 64],
                         [89, 86, 84, 81, 79, 76, 74, 71, 68, 65],
                         [91, 88, 85, 82, 80, 77, 75, 72, 69, 67],
                         [92, 89, 86, 84, 81, 79, 76, 74, 71, 68],
                         [94, 91, 88, 85, 82, 80, 77, 75, 72, 69],
                         [96, 92, 89, 86, 84, 81, 79, 76, 74, 71],
                         [98, 94, 91, 88, 85, 82, 80, 77, 75, 72],
                         [100, 96, 92, 89, 86, 84, 81, 79, 76, 74]];


/* This function accepts the values of the weight, reps, and rpe form inputs
 as parameters and calculates the estimated 1-rep max using the formula
  1-rep max = (weight * 100) / % 1-rep max. The % 1-rep max comes from the percentageArray at the corresponding RPE and reps index. The function returns
  the result of this calculation rounded to the nearest whole number. */
const calculateOneRepMax = (weight, reps, rpe) => {
    // (2 * rpe) - 12 will return the corresponding index in percentage array
    // e.g. (2 * 6) - 12 = 0
    // reps - 1 because reps start at 1
    let oneRepMax = (weight * 100) / percentageArray[(2 * rpe) -12][reps - 1];
    return Math.round(oneRepMax);
}

/* This function accepts a 1-rep max as a parameter, and uses it to calculate
 the estimated weight a user can lift at RPE 6-10 for 1-10 reps (by manipulating the calculate 1-rep max formula). These values are stored in weightArray which is parallel to percentageArray. The values are stored by iterating through the percentage array and calculating the weight for each RPE and reps index, then storing that result at the same indexes in the weightArray. This function returns the weightArray. */
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

/* This function accepts a 1-rep max as a parameter, then calls the calculateWeightUsingOneRepMax function to calculate the weights for all RPE and rep values. For each index of the weightArray, a <td> element with an id that matches the RPE and reps indexes is selected, then the innerText is updated to the corresponding RPE and reps index of the weightArray. */
const populateTable = (oneRepMax) => {
    let weightArray = calculateWeightUsingOneRepMax(oneRepMax);
    let tableDataElement;

    for (rpeIndex = 0; rpeIndex < 9; rpeIndex++) {
        for (repsIndex = 1; repsIndex <= 10; repsIndex++) {
            // selecting the <td> element for each index in the weightArray using the unique id's
            tableDataElement = document.getElementById(`rpe-${rpeIndex}-reps-${repsIndex}`);
            // adding the weight at the corresponding indexes to the <td> elements
            tableDataElement.innerText = `${weightArray[rpeIndex][repsIndex - 1]} ${weightUnit}`;
        }
    }
}

/* This function is functionally similar to populateTable, but clears the innerText of the <td> elements. */
const clearTable = () => {

    let tableDataElement;

    for (rpeIndex = 0; rpeIndex < 9; rpeIndex++) {
        for (repsIndex = 1; repsIndex <= 10; repsIndex++) {
            tableDataElement = document.getElementById(`rpe-${rpeIndex}-reps-${repsIndex}`);
            tableDataElement.innerText = '';
        }
    }
}

/* This function is used to toggle the weight unit from lbs-kg or kg-lbs depending on the current weight unit. Each time this function is called (from the convertBtn click event listener) the unitClickCount is incremented and is used in an even/odd check to decide which value to use in the 1-rep max calculation. The conversion rate and the weight unit are toggled every time the function is called. If the click count is odd (first click, count is initialized to 0), the value of the weight input and the conversion rate are used in the 1-rep max calculation. On even clicks, the weight value is used without the conversion rate to go back to the original value. */
function toggleUnitConversion() {
    // tracking the number of times the button has been clicked to create a toggle function. This gets reset when new values are submitted or the form is cleared.
    unitClickCount++;
    // toggling the conversion rate based on the current weight unit
    let conversion = weightUnit === 'lbs' ? 0.453592 : 2.20462; 
    // toggling the weight unit
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


