/**
   * generates the hints information needed to create the bingo board and others.
   * @param {Model} Model - object used to keep track of the game/player
   */
function generateHint(Model, View) {
    //calculate max word length for guesses
    let maxWordLength = 0;
    for (let index = 0; index < Model.possibleGuesses.length; index++) {
        if (Model.possibleGuesses[index].length > maxWordLength) {
            maxWordLength = Model.possibleGuesses[index].length;
        }
    }

    //create jagged array.
    let guessTable = [[], [], [], [], [], [], []]; // a jagged array of size 7 for each unique letter by maxWordLength size.
    let pangram = Model.currentPuzzle;
    let colTotalCount = [];

    for (let i = 0; i < 7; i++) {
        //1) First grab current letter
        let searchChar = pangram[i];
        let rowTotalCount = 0;
        guessTable[i].push(searchChar);
        for (let j = 4; j <= maxWordLength; j++) {
            //search the word list for total amount of words that begin with searchChar
            let counter = 0;
            for (let k = 0; k < Model.possibleGuesses.length; k++) {
                if (
                    Model.possibleGuesses[k]
                        .toUpperCase()
                        .startsWith(searchChar.toUpperCase()) &&
                    Model.possibleGuesses[k].length === j
                ) {
                    counter++;
                    rowTotalCount++;
                }
            }
            if (i === 0) {
                colTotalCount.push(counter);
            } else {
                colTotalCount[j - 4] += counter;
            }
            //insert that sum into the 2D array in the letter that we grab
            if (counter === 0) {
                guessTable[i].push("-");
            } else {
                guessTable[i].push(counter);
            }
        }



        guessTable[i].push(rowTotalCount);
    } //adding the word length row to length
    let temp = [];

    for (let i = 0; i < guessTable[0].length - 2; i++) {
        temp.push(i + 4);
    }
    temp.push("Σ");
    guessTable.unshift(temp);
    temp.unshift(" "); //add a space to first array cell 0 to line up with the other arrays
    colTotalCount.push(Model.possibleGuesses.length);
    guessTable.push(colTotalCount);
    guessTable[8].unshift("Σ");
    Model.currentPuzzleHints = guessTable;

    generateTwoLetterHint(Model);
    //console.table(Model.currentPuzzleHints, Model.currentPuzzleHints[0]);

    View.showHintGrid(Model.currentPuzzleHints);
    View.showTwoLetterHint(Model.currentPuzzleTwoLetterHint);

    generateBingo(Model);
}

/**
 * generates the two letter hints and stores them in the model.
 * @param {Model} Model - object used to keep track of the game/player
 */
function generateTwoLetterHint(Model) {

    //clear the twoletterhint array before generating new hints
    Model.currentPuzzleTwoLetterHint = [];

    let hash = {};

    //Example of Iterator design pattern
    Model.possibleGuesses.forEach((word) => {
        //gets the two word letters for each of he found words
        let firstTwoLetters = word.substring(0, 2).toLowerCase();
        if (hash[firstTwoLetters] === undefined) {
            // Create new key and set its' value to 1
            hash[firstTwoLetters] = 1;
        } else {
            // Increment value of key by 1
            hash[firstTwoLetters] = hash[firstTwoLetters] + 1;
        }
    });

    for (const [key, value] of Object.entries(hash)) {
        Model.currentPuzzleTwoLetterHint.push(key + ": " + value);
    }
}

function generateBingo(Model) {
    let bingoCounter = 0;
    //column checker
    for (let i = 1; i < Model.currentPuzzleHints.length - 1; i++) {
        let isValid = 1;
        for (let j = 0; j < Model.currentPuzzleHints.length; j++) {
            const element = Model.currentPuzzleHints[i][j];
            if (element == '-') {
                isValid = 0;
            }
        }
        if (isValid == 1) {
            bingoCounter++;
        }
    }
    console.log(Model.currentPuzzleHints);
    console.log(bingoCounter);

    //row checker
    for (let i = 1; i < Model.currentPuzzleHints[0].length - 1; i++) {
        let isValid = 1;
        for (let j = 1; j < Model.currentPuzzleHints.length - 1; j++) {
            const element = Model.currentPuzzleHints[j][i];
            if (element == '-') {
                isValid = 0;
            }
        }
        if (isValid == 1) {
            bingoCounter++;
        }
    }
    console.log(Model.currentPuzzleHints);
    console.log(bingoCounter);
}

function generateTotalPangrams(Model) {
    let maxPangrams = 0;

    //go through models possible guesses and count the amount of 7 letter unique words and add them to maxPangrams in model
    //how to check for unique words for a given puzzle?

    for (let i = 0; i < Model.possibleGuesses.length; i++) {

    }


}

module.exports = { generateHint, generateTwoLetterHint };