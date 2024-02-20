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
    return (weight * 100) / percentageArray[(2 * rpe) -12][reps - 1];
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
