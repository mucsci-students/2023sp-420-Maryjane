
// Used to keep track of all things related to the puzzle/game
class GameManager {

  // Class vars

  // Store whether the player currently has a puzzle open
  isPuzzleOpen = false;
  
  // Stores all the words found by the user.
  foundWords = [];

  // Stores the seven letter puzzle
  pangram = "";

  // Stores the letter that is required in the puzzle
  requiredLetter = "";

  // Stores the users points
  userPoints = 0;

  // Default constructor
  constructor() {
  
  }

}

// Export class as a module
module.exports = GameManager;
