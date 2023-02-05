// Import the ckeck word class for validating user guesses
const wordsClass = require("check-word");
const Database = require("./Database");
const GameManager = require("./GameManager");

// dictionary object used to check whether a word is valid or not
const dictionary = wordsClass("en");

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
      //promptSave();
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
      console.log ('No puzzle in progress');
      return;
    }

    // TODO - calculate rank in the future.
    let rank = "beginner";

    console.log (GameManager.userPoints + "/100 points");
    console.log ("Your rank: " + rank);
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
}

module.exports = Commands;
