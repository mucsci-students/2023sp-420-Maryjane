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

  //stores the high scores for the current puzzle
  highScores = "";

  // Max user points
  maxPoints = 0;

  //total pangrams for the current puzzle
  totalPangrams = 0;

  //total amount of bingos for the puzzle
  bingoCount = 0;

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
   * @param {number} scorePercentage
   * @returns Your name as rank
   */
  getRankName(scorePercentage) {
    //Maybe make this a switch statement sometime? -Michael

    // Check for out of bounds and incorrect type
    if (scorePercentage < 0 || typeof scorePercentage !== "number") {
      return "Something went wrong";
    }

    if (scorePercentage < 0.02) {
      return "Newbie";
    } else if (scorePercentage < 0.05) {
      return "Novice";
    } else if (scorePercentage < 0.08) {
      return "Fine";
    } else if (scorePercentage < 0.15) {
      return "Skilled";
    } else if (scorePercentage < 0.25) {
      return "Excellent";
    } else if (scorePercentage < 0.4) {
      return "Superb";
    } else if (scorePercentage < 0.5) {
      return "Marvellous";
    } else if (scorePercentage < 0.7) {
      return "Outstanding";
    } else if (scorePercentage <= 1) {
      return "Queen Bee";
    }

    return "Something went wrong";
  }

  /**
   * Shuffles the current puzzle
   * @returns {boolean} - Returns true if the shuffle was successful, false if no shuffle was performed.
   */
  shufflePuzzle() {
    if (!this.isPuzzleOpen) {
      return false;
    }

    // Using the Fisher-Yates shuffle algorithm for a more uniform shuffle
    for (let i = this.currentPuzzle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.currentPuzzle[i], this.currentPuzzle[j]] = [this.currentPuzzle[j], this.currentPuzzle[i]];
    }

    return true;
  }

  /**
   * 
   */
  calculateHighScore() {
    // Get the user's score
    let score = this.userPoints;

    // Check if the score is greater than the current high score
    if (score > this.highScore) {
      // Update the high score
      this.highScore = score;

      // Log a success message
      score += score;
    } else {
      // Log a message indicating no new high score was achieved
      score -= score;
    }
  }


}

// Export the static method instead of the class itself
module.exports = Model;
