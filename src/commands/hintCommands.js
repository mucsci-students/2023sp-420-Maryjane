
/**
   * generates the hints information needed to create the bingo board and others.
   * @param {Model} Model - object used to keep track of the game/player
   */
function generateHint(Model) {
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
    colTotalCount.push(Model.possibleGuesses.length);
    guessTable.push(colTotalCount);
    Model.currentPuzzleHints = guessTable;
    console.log(guessTable);

    generateTwoLetterHint(Model);
}

/**
 * generates the two letter hints and stores them in the model.
 * @param {Model} Model - object used to keep track of the game/player
 */
function generateTwoLetterHint(Model) {
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
module.exports = {generateHint, generateTwoLetterHint};