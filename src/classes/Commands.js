// Import the ckeck word class for validating user guesses
const wordsClass = require("check-word");
const Database = require("./Database");
const GameManager = require("./GameManager");

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

    Commands.updatePuzzleRank(input, GameManager);

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

  /**
   * Uses the algorithm that the SpellingBee.org website uses to update the players rank/score.
   * @param {String} word - the user guess
   * @param {GameManager} GameManager - the gamemanager object
   */
  static updatePuzzleRank(word, GameManager) {

    //Shifts it so you get 1 point for a 4 letter word, 2 points for 5 letters, etc.
    let score = word.length - 3;
    let USED_ALL_LETTERS_BONUS = 7;

    if (word === GameManager.pangram) {
      score += USED_ALL_LETTERS_BONUS;
    }

    GameManager.userPoints += score;

  }

  /**
   * Displays the users currect 
   * @param {GameManager} GameManager - GameMangager object used to check if puzzle is open and to show the puzzle rank
   * @returns 
   */
  static showPuzzleRank(GameManager) {
    if (!GameManager.isPuzzleOpen) {
      console.log('No puzzle in progress');
      return;
    }

    // TODO - calculate rank in the future.
    let rank = "beginner";

    console.log(GameManager.userPoints + "/100 points");
    console.log("Your rank: " + rank);
  }

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
   * Loads a saved puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {fileName} fileName - users inputted file name
   */
  static load(fileName, GameManager) {

    //check if a game is already in progress, if it is dont load a new game
    if (GameManager.isPuzzleOpen) {
      this.promptSave(GameManager);
    }

    // Append ".json" to the filename if it doesn't already have it
    //note: you can change the .BEE to .JSON if you want
    if (!fileName.endsWith(".BEE")) {
      fileName += ".BEE";
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
    //I could make a save signature and check for that instead of checking for all the fields?
    //^this would be more robust in case I add more fields to the save file, revisit this later!
    if (!parsedFile.hasOwnProperty("words") ||
      !parsedFile.hasOwnProperty("pangram") ||
      !parsedFile.hasOwnProperty("requiredLetter") ||
      !parsedFile.hasOwnProperty("userPoints")) {
      console.log("SpellingBee> File is not a valid spelling bee file");
      return;
    }

    // If all checks passed, update the GameManager fields with the loaded data from the file
    GameManager.foundWords = parsedFile.words;
    GameManager.pangram = parsedFile.pangram;
    GameManager.requiredLetter = parsedFile.requiredLetter;
    GameManager.userPoints = parsedFile.userPoints;
    GameManager.isPuzzleOpen = true;
    console.log("SpellingBee> File loaded successfully");
  }

  /**
   * Saves current puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {fileName} fileName - users inputted file name
   * @returns null
   */
  static save(fileName, GameManager) {

    if (!GameManager.isPuzzleOpen) {
      console.log("SpellingBee> No puzzle open, you can not save");
      return;
    }

     //note: you can change the .BEE to .JSON if you want
    if (!fs.existsSync(fileName + ".BEE")) {

      let table = {
        words: GameManager.foundWords,
        pangram: GameManager.pangram,
        requiredLetter: GameManager.requiredLetter,
        userPoints: GameManager.userPoints,
      };

      let jsonFile = JSON.stringify(table);
       //note: you can change the .BEE to .JSON if you want
      fs.writeFileSync(fileName + ".BEE", jsonFile, 'utf8', (err) => { if (err) throw err; });
      console.log('SpellingBee> The file has been saved!');
      GameManager.isPuzzleOpen = false;
    }
    else {
      console.log("SpellingBee> File already exists, please call save command with another file name");
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
    }
  }
}
module.exports = Commands;
