const fs = require("fs");
const prompt = require("prompt-sync")();
const aes256 = require("aes256"); //!FIXME 

/**
   * Loads a saved puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @param {string} fileName - users inputted file name
   */
function load(fileName, Model, View) {
    let shouldDecrypt = 0;

    //check if a game is already in progress, if it is dont load a new game
    if (Model.isPuzzleOpen) {
        promptSave(Model);
    }

    // Append ".json" to the filename if it doesn't already have it
    if (!fileName.endsWith(".json")) {
        fileName += ".json";
    }

    // Check if the file exists
    if (!fs.existsSync(fileName)) {
        console.log("SpellingBee> File does not exist or invalid file name/type");
        return;
    }

    // Read the file contents
    let fileContents = fs.readFileSync(fileName, "utf-8");

    // Parse the file contents as JSON
    let parsedFile;
    try {
        parsedFile = JSON.parse(fileContents);
    } catch (e) {
        console.log("SpellingBee> File is not a valid SpellingBee JSON file");
        return;
    }

    // Check if the file is a spelling bee file
    if (
        !parsedFile.hasOwnProperty("GuessedWords") ||
        !parsedFile.hasOwnProperty("PuzzleLetters") ||
        !parsedFile.hasOwnProperty("RequiredLetter") ||
        !parsedFile.hasOwnProperty("CurrentPoints") ||
        !parsedFile.hasOwnProperty("MaxPoints") ||
        !parsedFile.hasOwnProperty("WordList")
    ) {
        console.log("SpellingBee> File is not a valid spelling bee file");
        return;
    }

    // If all checks passed, update the Model fields with the loaded data from the file
    Model.foundWords = parsedFile.GuessedWords.map((element) =>
        element.toUpperCase()
    );
    Model.pangram = parsedFile.PuzzleLetters.toUpperCase();
    Model.requiredLetter = parsedFile.RequiredLetter.toUpperCase();
    Model.userPoints = parsedFile.CurrentPoints;

    //!FIXME
    Model.possibleGuesses = 
    //Model.possibleGuesses = shouldDecrypt ? aes256.decrypt(key, parsedFile.WordList.map((element) => element.toUpperCase())) : parsedFile.WordList.map((element) => element.toUpperCase());
    Model.maxPoints = parsedFile.MaxPoints;

    let puzzle = String.prototype.concat
        .call(...new Set(Model.pangram))
        .split("");

    Model.currentPuzzle = puzzle
        .sort((a, b) => 0.5 - Math.random())
        .sort((a, b) => 0.5 - Math.random());

    Model.isPuzzleOpen = true;
    console.log("SpellingBee> File loaded successfully\n");
    console.log("Puzzle is shown below");

    View.showPuzzle(Model);
}

/**
 * Saves current puzzle
 * @param {Model} Model - object used to keep track of the game/player
 * @param {string} fileName - users inputted file name
 * @returns null
 */
function save(fileName, Model) {
    let shouldEncrypt = 0;

    if (!Model.isPuzzleOpen) {
        console.log("SpellingBee> No puzzle open, you cannot save");
        return false;
    }

    if (fileName === "") {
        console.log("SpellingBee> File name cannot be empty");
        return false;
    }

    //{"RequiredLetter": "a", "PuzzleLetters": "acklorw", "CurrentPoints": 0, "MaxPoints": 323, "GuessedWords": [], "WordList": ["acro"]}

    if (!fs.existsSync(fileName + ".json")) {
        let table = {
            RequiredLetter: Model.requiredLetter.toLowerCase(),
            PuzzleLetters: Model.currentPuzzle
                .toString()
                .toLowerCase()
                .replace(/,/g, ""),
            CurrentPoints: Model.userPoints,
            MaxPoints: Model.maxPoints,
            GuessedWords: Model.foundWords.map((element) => element.toLowerCase()),

            //!FIXME
            //cracked use of ternary operator (?) !!! lol -Michael
            WordList: shouldEncrypt ? aes256.encrypt(key, Model.possibleGuesses.map((element) => element.toLowerCase())) : Model.possibleGuesses.map((element) => element.toLowerCase())
        };



        let jsonFile = JSON.stringify(table);

        fs.writeFileSync(fileName + ".json", jsonFile, "utf8", (err) => {
            if (err) throw err;
        });
        console.log("SpellingBee> The file has been saved!");
        Model.isPuzzleOpen = false;
        return true;
    } else {
        console.log("SpellingBee> File already exists");
        let fileName = prompt("SpellingBee> Enter a file name: ");
        while (fileName === "") {
            fileName = prompt("SpellingBee> Enter a file name: ");
        }
        this.save(fileName, Model);
    }
}

/**
 * prompts user to save current puzzle when they try to start a new one
 * @param {Model} Model - object used to keep track of the game/player
 * @returns null
 */
function promptSave(Model) {
    let save = prompt(
        "SpellingBee> Would you like to save your current game? (yes/no) "
    );

    save = save.toString().toLowerCase();

    while (save !== "yes" && save !== "no") {
        console.log("SpellingBee> You must type either yes or no");
        save = prompt(
            "SpellingBee> Would you like to save your current game? (yes/no) "
        );
        save = save.toString().toLowerCase();
    }

    if (save === "yes") {
        let fileName = prompt("SpellingBee> Enter a file name: ");
        while (fileName === "") {
            fileName = prompt("SpellingBee> Enter a file name: ");
        }
        this.save(fileName, Model);
    } else {
        console.log("SpellingBee> The game has been discarded");
        Model.isPuzzleOpen = false;
    }
}
module.exports = { load, save, promptSave };
