
// Import the ckeck word class for validating user guesses
const wordsClass = require('check-word');

// dictionary object used to check whether a word is valid or not
const dictionary = wordsClass('en');

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
    input = input + '';
    input = input.toLowerCase();

    if (!GameManager.isPuzzleOpen) {
      console.log('No puzzle in progress');
      return;
    }

    if (input.length < 4) {
      console.log('Guess must be at least 4 characters');
      return;
    }

    // Check that the input has the required lettter
    if (input.search(GameManager.requiredLetter.toLowerCase()) === -1) {
      console.log('Guess must contain required character\nThe required character is', GameManager.requiredLetter);
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

    Commands.updatePuzzleRank()

    console.log('success');

  }

  /**
   * Generates a new puzzle. At the moment, it is always the same puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @returns null
   */
  static newPuzzle(GameManager) {
    if (GameManager.isPuzzleOpen) {
      console.log("game is in progess");
      //promptSave();
      return;
    }

    GameManager.isPuzzleOpen = true;
    GameManager.pangram = "pinewood";
    GameManager.requiredLetter = "I";

    //TODO - SHUFFLE WORD AND STORE IN NEW GAMEMANAGER VAR
    //TODO - SHOW SHUFFLED WORD/LETTERS

    console.log("New puzzle started");
  }

  //TODO
  static updatePuzzleRank() {

  }

}

module.exports = Commands;
