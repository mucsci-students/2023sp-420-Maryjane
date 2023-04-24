const { calculatePoints } = require("./newPuzzleCommands");
const highScore = require("./highScoreCommand.js");
const { promptSave } = require("./fileCommands");
/**
 * Used to check if a users guess is valid. If it is, the word gets inserted into Model.foundWords
 * @param {string} input - The input/guess the user made.
 * @param {Model} Model - The Model object used to keep track of the game
 * @returns a bool that is true if the guess was valid and inserted, false if not
 */
function guess(input, Model, View) {
  //Converts input to a string
  input = input + "";
  input = input.toUpperCase();

  if (!Model.isPuzzleOpen) {
    View.showErrorMessage("No puzzle in progress");
    return false;
  }

  if (input.length < 4) {
    View.showErrorMessage("Guess must be at least 4 characters");
    return false;
  }

  // Check that the input has the required letter
  if (input.search(Model.requiredLetter.toUpperCase()) === -1) {
    View.showErrorMessage("Missing Required Letter");
    return false;
  }

  // Check that all letters of the input are allowed letters determined by the pangram
  for (let i = 0; i < input.length; i++) {
    if (
      Model.pangram.toUpperCase().search(input.charAt(i).toUpperCase()) === -1
    ) {
      View.showErrorMessage(
        input.charAt(i) + " is not in the required letters"
      );
      return false;
    }
  }

  // Check that guess is not in the found words
  if (Model.foundWords.includes(input)) {
    View.showErrorMessage(input + " was already guessed");
    return false;
  }

  let found = false;

  //Example of Iterator design pattern
  Model.possibleGuesses.forEach((element) => {
    if (input.toLowerCase() === element.toLowerCase()) {
      found = true;
    }
  });

  if (!found) {
    View.showErrorMessage(input + " is not a word");
    return false;
  }

  // Insert the guess into list of found words and increase user points
  Model.foundWords.push(input);

  Model.userPoints += calculatePoints(input, Model);

  if (
    input === Model.pangram ||
    String.prototype.concat.call(...new Set(input)).split("").length === 7
  ) {
    View.showPangramMessage(input);
  } else {
    if (Model.userPoints === Model.maxPoints) {
      View.showSuccessMessage(
        "SpellingBee> You have found all the words! You are QUEEN BEE!\n"
      );
      highScore.addHighScore(Model);
      process.exit(0);
    } else {
      View.showSuccessMessage("Success!");
    }
  }

  return true;
}

module.exports = guess;
