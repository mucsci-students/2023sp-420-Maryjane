const MongoDB = require("../database/lib/mongodb.js");
const Model = require("../model/Model");

const prompt = require("prompt-sync")();

const isWord = require("../dict.js");

const scrabble = require('scrabble');

//file system module
const fs = require("fs");

/**
 * Commands class used to store static helper methods for the cli.
 */
class Commands {
  /**
   * Used to check if a users guess is valid. If it is, the word gets inserted into Model.foundWords
   * @param {string} input - The input/guess the user made.
   * @param {Model} Model - The Model object used to keep track of the game
   * @returns a bool that is true if the guess was valid and inserted, false if not
   */
  static guess(input, Model, View) {
    //Converts input to a string
    input = input + "";
    input = input.toUpperCase();

    if (!Model.isPuzzleOpen) {
      View.showErrorMessage("No puzzle in progress");
      return false;
    }

    if (input.length < 4) {
      View.showErrorMessage("Guess must be at least 4 characters");

      return false;
    }

    // Check that the input has the required letter
    if (input.search(Model.requiredLetter.toUpperCase()) === -1) {
      View.showErrorMessage("Missing Required Letter");
      return false;
    }

    // Check that all letters of the input are allowed letters determined by the pangram
    for (let i = 0; i < input.length; i++) {
      if (Model.pangram.toUpperCase().search(input.charAt(i).toUpperCase()) === -1) {
        View.showErrorMessage(
          input.charAt(i) + " is not in the required letters"
        );
        return false;
      }
    }

    // Check that guess is not in the found words
    if (Model.foundWords.includes(input)) {
      View.showErrorMessage(input + " was already guessed");
      return false;
    }

    let found = false;

    Model.possibleGuesses.forEach(element => {
      if (input.toLowerCase() === element.toLowerCase()) {
        found = true;
      }
    });

    if (!found) {
      View.showErrorMessage(input + " is not a word");
      return false;
    }

    // Check that the guess is a real word
    // if (!isWord(input)) {
    //   View.showErrorMessage(input + " is not a word");
    //   return false;
    // }

    // Insert the guess into list of found words and increase user points
    Model.foundWords.push(input);

    Model.userPoints += Commands.calculatePoints(input, Model);

    if (input === Model.pangram || String.prototype.concat.call(...new Set(input)).split("").length === 7) {
      View.showPangramMessage(input);
    } else {
      View.showSuccessMessage("Success!");
    }

    return true;
  }

  /**
   * Generates a new puzzle. At the moment, it is always the same puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @param {MongoDB} MongoDB - object used to keep track of the game/player
   * @returns null
   */
  static async newPuzzle(Model, MongoDB, View) {
    if (Model.isPuzzleOpen) {
      //CLI case
      if (typeof window === "undefined") {
        this.promptSave(Model);
      }
    }

    let pangram = MongoDB.getRandomWord();
    pangram = pangram.toUpperCase();

    // Converts pangram into array of letters
    let pangramLetters = String.prototype.concat
      .call(...new Set(pangram))
      .split("");
    Model.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["J", "Q", "X", "Z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
      (element) => !toRemove.includes(element)
    );

    Model.isPuzzleOpen = true;
    Model.pangram = pangram;
    Model.requiredLetter =
      pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    Model.maxPoints = 0;

    Model.possibleGuesses = scrabble((pangram + pangram + pangram).toLowerCase()).filter((element) => {
      return (element.length >= 4 && element.includes(Model.requiredLetter.toLowerCase()))
    });

    Model.possibleGuesses.forEach(element => {
      Model.maxPoints += Commands.calculatePoints(element, Model);
    });

    View.showSuccessMessage("New puzzle started below! ");
    Model.userPoints = 0;
    Model.foundWords = [];
    View.showPuzzle(Model);
  }

  /**
   * Uses the algorithm that the SpellingBee.org website uses to update the players rank/score.
   * @param {String} word - the user guess
   * @param {Model} Model - the Model object
   */
  static calculatePoints(word, Model) {
    //Shifts it, so you get 1 point for a 4-letter word, 2 points for 5 letters, etc.
    let score = 0;
    let USED_ALL_LETTERS_BONUS = 7;

    if (word.length === 4) {
      score += 1;
    } else {
      score += word.length;
    }

    // If word is the current pangram on any pangram
    if (word === Model.pangram || String.prototype.concat.call(...new Set(word)).split("").length === 7) {
      score += USED_ALL_LETTERS_BONUS;
    }

    return score;
  }

  static shuffle(Model, View) {
    if (!Model.isPuzzleOpen) {
      console.log("game is not in progess");
      return;
    }

    // Converts pangram into array of letters
    Model.currentPuzzle = Model.currentPuzzle
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());

    View.showPuzzle(Model);
  }

  /**
   * Generates a new puzzle based on user inputted word
   * @param {Model} Model - object used to keep track of the game/player
   * @param {string} input - users inputted word
   * @returns
   */
  static identifyBaseWord(input, Model, View) {
    if (input === null || input === undefined) {
      View.showErrorMessage("No input");
      return;
    } else if (input.length < 7) {
      View.showErrorMessage("Word must be at least 7 characters");
      return;
    }

    input = input + "";
    input = input.toUpperCase();

    if (Model.isPuzzleOpen) {
      //CLI case
      if (typeof window === "undefined") {
        this.promptSave(Model);
      }
    }
    // Checks user's word to have correct length and no spaces
    if (String.prototype.concat.call(...new Set(input)).length !== 7) {
      View.showErrorMessage("The new word must have 7 unique letters and no spaces");
      return;
    }

    //Checks user's word to be an actual word in the dictionary
    if (!isWord(input)) {
      View.showErrorMessage(input + " was not found in the dictionary");
      return;
    }

    let pangram = input;
    pangram = pangram.toUpperCase();

    // Converts pangram into array of letters
    let pangramLetters = String.prototype.concat
        .call(...new Set(pangram))
        .split("");
    Model.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["J", "Q", "X", "Z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
      (element) => !toRemove.includes(element)
    );

    Model.isPuzzleOpen = true;
    Model.pangram = pangram;
    Model.requiredLetter =
      pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    Model.maxPoints = 0;

    Model.possibleGuesses = scrabble((pangram + pangram + pangram).toLowerCase()).filter((element) => {
      return (element.length >= 4 && element.includes(Model.requiredLetter.toLowerCase()))
    });

    Model.possibleGuesses.forEach(element => {
      Model.maxPoints += Commands.calculatePoints(element, Model);
    });

    View.showSuccessMessage("New puzzle started below! ");
    Model.userPoints = 0;
    Model.foundWords = [];
    View.showPuzzle(Model);
  }

  /**
   * Loads a saved puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @param {string} fileName - users inputted file name
   */
  static load(fileName, Model, View) {
    //check if a game is already in progress, if it is dont load a new game
    if (Model.isPuzzleOpen) {
      this.promptSave(Model);
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
    Model.foundWords = parsedFile.GuessedWords.map(element => element.toUpperCase());
    Model.pangram = parsedFile.PuzzleLetters.toUpperCase();
    Model.requiredLetter = parsedFile.RequiredLetter.toUpperCase();
    Model.userPoints = parsedFile.CurrentPoints;
    Model.possibleGuesses = parsedFile.WordList.map(element => element.toUpperCase());
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
  static save(fileName, Model) {
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
        PuzzleLetters: Model.currentPuzzle.toString().toLowerCase().replace(/,/g, ""),
        CurrentPoints: Model.userPoints,
        MaxPoints: Model.maxPoints,
        GuessedWords: Model.foundWords.map(element => element.toLowerCase()),
        WordList: Model.possibleGuesses.map(element => element.toLowerCase())
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
  static promptSave(Model) {
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
}

module.exports = Commands;
