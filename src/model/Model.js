let MongoDB = require('../database/lib/mongodb.js');

// Used to keep track of all things related to the puzzle/game
class Model {

  // Class vars

  // Store whether the player currently has a puzzle open
  isPuzzleOpen = false;
  
  // Stores all the words found by the user.
  foundWords = [];

  // Stores the seven letter puzzle
  pangram = "";

  // Stores the puzzle as an array of letters in a random order
  currentPuzzle = [];

  // Stores the letter that is required in the puzzle
  requiredLetter = "";

  // Stores the users points
  userPoints = 0;

  // Possible guesses
  possibleGuesses = [];

  // Max user points
  maxPoints = 0;

  // Default constructor
  constructor() {
    this.database = new MongoDB();
  }

  /**
   * Calculates the users rank name based on scorePercentage
   * @param {number} score
   * @returns Your name as rank
   */
  getRankName(score) {            //Maybe make this a switch statement sometime? -Michael
    if (score < 0.02) {
      return "Newbie";
    } else if (score < 0.05) {
      return "Novice";
    } else if (score < 0.08) {
      return "Fine";
    } else if (score < 0.15) {
      return "Skilled";
    } else if (score < 0.25) {
      return "Excellent";
    } else if (score < 0.4) {
      return "Superb";
    } else if (score < 0.5) {
      return "Marvellous";
    } else if (score < 0.7) {
      return "Outstanding";
    } else if (score <= 1) {
      return "Queen Bee";
    }

    return "Something went wrong";
  }

}

// Export class as a module
module.exports = Model;
  