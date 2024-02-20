const form = document.getElementById('calculator-form');
const weight = document.getElementById('weight');
const lbs = document.getElementById('unit-lbs');
const kg = document.getElementById('unit-kg');
const reps = document.getElementById('reps');
const RPE = document.getElementById('rpe');
const oneRepMaxElement = document.getElementById('one-rep-max');

weight.focus();

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isFormValid(weight.value, reps.value, rpe.value)) {
        oneRepMaxElement.innerText = calculateOneRepMax(weight.value, reps.value, rpe.value);

        weight.focus();
    }
})

form.addEventListener('reset', (e) => {
    form.reset();
    oneRepMaxElement.innerText = '';
    weight.focus();
})

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

console.table(calculateWeightUsingOneRepMax(440));
