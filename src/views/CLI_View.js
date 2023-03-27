/**
 * Stores CLI View class
 */

/**
 * View for the CLI following the MVC Model
 */
class CLI_View {
  constructor() {}

  /**
   * Shows current found word in puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @returns
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
   * @param {Model} Model
   * @returns
   */
  showPuzzle(Model) {
    // If no current puzzle
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    //prints out the current puzzle and the required letter in the console
    console.log(
      "Use the letters below to make a guess, required letter is \x1b[93mYellow.\x1b[0m"
    );

    //check where required letter is in array
    if (Model.currentPuzzle[3] !== Model.requiredLetter) {
      for (let index = 0; index < 7; index++) {
        if (Model.currentPuzzle[index] === Model.requiredLetter) {
          //swaps where required letter is to the center of the array
          [Model.currentPuzzle[index], Model.currentPuzzle[3]] = [
            Model.currentPuzzle[3],
            Model.currentPuzzle[index],
          ];
        }
      }
    }

    //changes output letters to ALL-CAPS.
    for (let index = 0; index < Model.currentPuzzle.length; index++) {
      Model.currentPuzzle[index] = Model.currentPuzzle[index].toUpperCase();
    }
    let reqLetter = Model.currentPuzzle[3];

    //formatted output in a hex shape.
    console.log(
      "   %s     %s\n\n%s   \x1b[93m{ %s }\x1b[0m   %s\n\n   %s     %s",
      Model.currentPuzzle[0],
      Model.currentPuzzle[1],
      Model.currentPuzzle[2],
      reqLetter,
      Model.currentPuzzle[4],
      Model.currentPuzzle[5],
      Model.currentPuzzle[6]
    );
  }

  /**
   * Displays the users current rank in the puzzle
   * @param {Model} Model - Model object used to check if puzzle is open and to show the puzzle rank
   * @returns
   */
  showPuzzleRank(Model) {
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    const MAX_POINTS = Model.maxPoints;

    // Ranking system: https://freebee.fun/api.html

    let scorePercentage = Model.userPoints / MAX_POINTS;

    let rank = Model.getRankName(scorePercentage);

    console.log("Your rank: " + rank);
    console.log(Model.userPoints + `/${MAX_POINTS} points`);
  }

  showPangramMessage(message) {
    console.log(
      "\x1b[93mY\x1b[31mO\x1b[32mU \x1b[34mF\x1b[35mO\x1b[33mU\x1b[37mN\x1b[93mD \x1b[31mA \x1b[32mP\x1b[33mA\x1b[34mN\x1b[35mG\x1b[37mR\x1b[31mA\x1b[32mM\x1b[34m!\x1b[0m"
    );
    console.log("\x1b[93m" + message.toUpperCase() + "\x1b[0m");
  }


  showHintGrid(){
    
  }  

  showSuccessMessage(string) {
    console.log(string);
  }

  showErrorMessage(string) {
    console.error(string);
  }

  showHintMessage(Model) {
    console.log(Model.currentPuzzleHints);
  }

  showTwoLetterHint(Model) {
    console.log(Model.generateTwoLetterHint);
  }
}

module.exports = CLI_View;
