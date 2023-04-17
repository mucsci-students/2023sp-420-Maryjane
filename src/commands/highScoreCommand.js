const fs = require("fs");
const prompt = require("prompt-sync")();
const fileSystem = require("./fileSystem.js");

// //TODO!!! STILL IN PROGRESS (fix the method @)
// //TODO!! Insert into puzzle alphabetical
// !!!NOTE: NEED TO CLEAR THE highScoreDict.json before client demo
function highScoreCommand(Model) {
  //check if a puzzle is open
  if (!Model.isPuzzleOpen) {
    console.log("SpellingBee> No puzzle open, no high-scores available");
    return false;
  }

  //read the high score file
  let file = fileSystem.readJSONFile("highScoreDict.json");

  //the current puzzle string in alphabetical order
  let letters = Model.currentPuzzle
    .sort()
    .join()
    .replace(/,/g, "")
    .toUpperCase();

  //check if the puzzle exists in the high score file
  //if it doesnt exist the we should create a high score entry for it with the center letter
  //else if it does exist then we should check that a high score entry for it with the center letter exists
  //if the high score entry for it with the center letter doesnt exist then we should create it
  //else if it does exist
  //if the user has a highscore that can be put on the leader board then we should ask them for a user id and then put their score on the leader board
  //else then we should print the high scores

  //check if the puzzle exists in the high score file
  if (!file.highscores.hasOwnProperty(letters)) {
    console.log("SpellingBee> No high-scores available for this puzzle first");
    return false;
  }

  //now check that the center letter exists in the puzzle
  if (file.highscores[letters].center_letter != Model.requiredLetter) {
    console.log("SpellingBee> No high-scores available for this puzzle second");
    return false;
  }

  //now print the high scores
  for (let i = 0; i <= 4; i++) {
    console.log(
      "Rank: " +
        (i + 1) +
        " " +
        file.highscores[letters].scores[i].user_id +
        " " +
        file.highscores[letters].scores[i].score
    );
  }
}

module.exports = { highScoreCommand };
