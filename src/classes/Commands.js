// Import the ckeck word class for validating user guesses
const wordsClass = require("check-word");
const Database = require("./Database");

const prompt = require('prompt-sync')();

// dictionary object used to check whether a word is valid or not
const dictionary = wordsClass("en");

//file system module
var fs = require("fs");

/**
 * Commands class used to store static helper methods for the cli.
 */
class Commands {
  /**
   * Used to check if a users guess is valid. If it is, the word gets inserted into GameManager.foundWords
   * @param {string} input - The input/guess the user made.
   * @param {GameManager} GameManager - The gamemanager object used to keep track of the game
   * @returns null
   */
  static guess(input, GameManager) {
    //Converts input to a string
    input = input + "";
    input = input.toLowerCase();

    if (!GameManager.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    if (input.length < 4) {
      console.log("Guess must be at least 4 characters");
      return;
    }

    // Check that the input has the required lettter
    if (input.search(GameManager.requiredLetter.toLowerCase()) === -1) {
      console.log(
        "Guess must contain required character\nThe required character is",
        GameManager.requiredLetter
      );
      return;
    }

    // Check that all letters of the input are allowed letters determined by the pangram
    for (let i = 0; i < input.length; i++) {
      if (GameManager.pangram.search(input.charAt(i)) === -1) {
        console.log(input.charAt(i) + " is not in the required letters");
        return;
      }
    }

    // Check that guess is not in the found words
    if (GameManager.foundWords.includes(input)) {
      console.log("Invalid, " + input + " was already guessed");
      return;
    }

    // Check that the guess is a real word
    if (!dictionary.check(input)) {
      console.log(input + " was not found in the dictionary");
      return;
    }

    // Insert the guess into list of found words and increase user points
    GameManager.foundWords.push(input);

    Commands.updatePuzzleRank();

    console.log("success");
  }

  /**
   * Generates a new puzzle. At the moment, it is always the same puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {Database} Database - object used to keep track of the game/player
   * @returns null
   */
  static async newPuzzle(GameManager, Database) {
    if (GameManager.isPuzzleOpen) {
      console.log("game is in progess");
      this.promptSave(GameManager);
      return;
    }

    let pangram = await Database.getRandomWord();

    // Converts pangram into array of letters
    let pangramLetters = pangram.split("");
    GameManager.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["j", "q", "x", "z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
      (element) => !toRemove.includes(element)
    );

    GameManager.isPuzzleOpen = true;
    GameManager.pangram = pangram;
    GameManager.requiredLetter =
      pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    console.log("New puzzle started, below is for testing purposes only");
    console.log(GameManager.currentPuzzle);

    //showPuzzle()
  }

  //TODO
  static updatePuzzleRank() { }

  static async shuffle(GameManager, Database) {
    if (!GameManager.isPuzzleOpen) {
      console.log("game is not in progess");
      return;
    }

    let pangram = await GameManager.pangram;
    let pangramLetters = pangram.split("");

    // Converts pangram into array of letters
    GameManager.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());
    console.log(GameManager.currentPuzzle);
  }

  /**
   * Generates a new puzzle based on user inputted word
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {input} input - users inputted word
   * @returns null
   */
  static identifyBaseWord(input, GameManager) {
    input = input + "";
    input = input.toLowerCase();

    // Checks user's word to have correct length and no spaces
    if (input.length != 7) {
      console.log("The new word must have 7 unique letters and no spaces");
      return;
    }

    // Checks user's word to be an actual word in the dictionary
    if (!dictionary.check(input)) {
      console.log(input + " was not found in the dictionary");
      return;
    }

    // Converts pangram into array of letters
    let pangram = input;
    let pangramLetters = pangram.split("");
    GameManager.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["j", "q", "x", "z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
      (element) => !toRemove.includes(element)
    );

    GameManager.isPuzzleOpen = true;
    GameManager.pangram = pangram;
    GameManager.requiredLetter =
      pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    console.log("New puzzle started, below is for testing purposes only");
    console.log(GameManager.currentPuzzle);
  }

  /**
   * Shows current found word in puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @returns null
   */
  static showFoundWords(GameManager) {
    // If no current puzzle
    if (!GameManager.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    // If no words found yet
    if (GameManager.foundWords.length <= 0) {
      console.log("No words found");
      return;
    }

    console.log(GameManager.foundWords);
  }

  /**
   * Saves current puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {fileName} fileName - users inputted file name
   * @returns null
   */
  static save(fileName, GameManager) {
    if (GameManager.isPuzzleOpen == false) {
      console.log("SpellingBee> No puzzle open, you can not save");
      return;
    }
    else {
      if (!fs.existsSync(fileName + ".json")) {
        let table = {
          words: GameManager.foundWords,
          pangram: GameManager.pangram,
          requiredLetter: GameManager.requiredLetter,
          userPoints: GameManager.userPoints,
        };
        let jsonFile = JSON.stringify(table);
        fs.writeFile(fileName + ".json", jsonFile, 'utf8', (err) => { if (err) throw err; });
        console.log('SpellingBee> The file has been saved!');
        GameManager.isPuzzleOpen = false;
        return;
      }
      else {
        console.log("SpellingBee> File already exists, please choose another name and try again");
        return;
      }
    }
  }

  /**
   * prompts user to save current puzzle when they try to start a new one
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @returns null
   */
  static promptSave(GameManager) {
    let save = prompt('SpellingBee> Would you like to save your current game? (yes/no) ');
    save = save.toString().toLowerCase();
    while (save !== 'yes' && save !== 'no') {
      console.log("SpellingBee> You must type either yes or no");
      save = prompt('SpellingBee> Would you like to save your current game? (yes/no) ');
      save = save.toString().toLowerCase();
    }
    if (save === 'yes') {
      let fileName = prompt('SpellingBee> Enter a file name: ');
      this.save(fileName, GameManager);
    }
    else {
      console.log("SpellingBee> The game has been discarded");
      GameManager.isPuzzleOpen = false;
      return;
    }
  }
}
module.exports = Commands;
