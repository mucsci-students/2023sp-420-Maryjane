let MongoDB = require("./database/lib/mongodb.js");

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

  // Stores the hints for the currentPuzzle
  currentPuzzleHints = [[]];

  // Store the two letter hints
  currentPuzzleTwoLetterHint = [];

  // Stores the letter that is required in the puzzle
  requiredLetter = "";

  // Stores the users points
  userPoints = 0;

  // Possible guesses
  possibleGuesses = [];

  // Max user points
  maxPoints = 0;

  //total pangrams for the current puzzle
  totalPangrams = 0;

  //total amount of bingos for the puzzle
  bingoCount = 0;

  //stores the high scores for the current puzzle
  highScores = "";

  // Private constructor
  constructor() {
    // Checks null
    if (!Model.instance) {
      this.database = new MongoDB();
      Model.instance = this;
    }

    return Model.instance;
  }

  /**
   * Calculates the users rank name based on scorePercentage
   * @param {number} score
   * @returns Your name as rank
   */
  getRankName(score) {
    //Maybe make this a switch statement sometime? -Michael

    // Check for out of bounds and incorrect type
    if (score < 0 || typeof score !== "number") {
      return "Something went wrong";
    }

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

// Export the static method instead of the class itself
module.exports = Model;
