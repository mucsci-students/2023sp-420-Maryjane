/**
 * Stores CLI View class
 */


/**
 * View for the CLI following the MVC Model
 */
class CLI_View {

  constructor() { }

  /**
   * Shows current found word in puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @returns null
   */
  showFoundWords(Model) {
    // If no current puzzle
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return false;
    }

    // If no words found yet
    if (Model.foundWords.length <= 0) {
      console.log("No words found");
      return;
    }

    console.log(Model.foundWords);
  }

  /**
   * Shows the current puzzle and the required letter
   * @param {*} Model
   * @returns null
   */
  showPuzzle(Model) {
    // If no current puzzle
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    //prints out the currnet puzzle and the required letter in the console
    console.log("Use the letters below to make a guess, required letter is \x1b[93mYellow.\x1b[0m");

    //check where required letter is in array
    if (Model.currentPuzzle[3] != Model.requiredLetter) {
      for (let index = 0; index < 7; index++) {
        if (Model.currentPuzzle[index] == Model.requiredLetter) {
          //swaps where required letter is to the center of the array
          [Model.currentPuzzle[index], Model.currentPuzzle[3]] = [Model.currentPuzzle[3], Model.currentPuzzle[index]]
        }
      }
    }

    //changes output letters to ALLCAPS.
    for (let index = 0; index < Model.currentPuzzle.length; index++) {
      Model.currentPuzzle[index] = Model.currentPuzzle[index].toUpperCase();
    }
    let reqLetter = Model.currentPuzzle[3];

    //formatted output in a hex shape. 
    console.log("   %s     %s\n\n%s   \x1b[93m{ %s }\x1b[0m   %s\n\n   %s     %s", Model.currentPuzzle[0], Model.currentPuzzle[1], Model.currentPuzzle[2], reqLetter, Model.currentPuzzle[4], Model.currentPuzzle[5], Model.currentPuzzle[6]);
  }

  /**
   * Displays the users currect
   * @param {Model} Model - GameMangager object used to check if puzzle is open and to show the puzzle rank
   * @returns null
   */
  showPuzzleRank(Model) {
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    const MAX_POINTS = 150;

    // Ranking system: https://freebee.fun/api.html

    let scorePercentage = Model.userPoints / MAX_POINTS;

    let rank = Model.getRankName(scorePercentage);

    console.log(Model.userPoints + `/${MAX_POINTS} points`);
    console.log("Your rank: " + rank);
  }

  printMessage(string) {
    console.log(string);
  }

  printError(string) {
    console.error(string);
  }


}

module.exports = CLI_View;