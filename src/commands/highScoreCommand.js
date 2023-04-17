const fs = require("fs");
const prompt = require("prompt-sync")();
const fileSystem = require("./fileSystem.js");

// //TODO!!! STILL IN PROGRESS (fix the method @)
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

function addHighScore(Model) {
  //check if a puzzle is open
  if (!Model.isPuzzleOpen) {
    console.log("SpellingBee> No puzzle open, no high-scores available");
    return false;
  }

  //the current puzzle string in alphabetical order
  let puzzle = Model.currentPuzzle
    .sort()
    .join()
    .replace(/,/g, "")
    .toUpperCase();

  // Read the highscore file
  let data = fs.readFileSync("highScoreDict.json");
  let highscores = JSON.parse(data);

  // Check if the puzzle exists in the highscore file
  if (!highscores.highscores.hasOwnProperty(puzzle)) {
    // If it doesn't, create a new entry for the puzzle
    highscores.highscores[puzzle] = {
      center_letter: Model.requiredLetter,
      scores: [],
    };
  }

  // Check if the center letter for the puzzle matches the required letter
  if (highscores.highscores[puzzle].center_letter !== Model.requiredLetter) {
    console.log("Center letter doesn't match the required letter");
    return false;
  }

  // Create a new highscore object with the user ID and score
  let newHighScore = {
    user_id: "Jon",
    score: Model.userPoints,
  };

  // Add the new highscore object to the "scores" array for the puzzle
  let scores = highscores.highscores[puzzle].scores;
  let index = scores.findIndex((s) => s.score < Model.userPoints);
  if (index === -1) {
    scores.push(newHighScore);
  } else {
    scores.splice(index, 0, newHighScore);
  }
  scores.splice(5);

  // Write the updated JSON object to the file
  fs.writeFileSync("highScoreDict.json", JSON.stringify(highscores, null, 2));

  return true;

  //if it doesnt exist the we should create a high score entry for it with the center letter
  //else if it does exist then we should check that a high score entry for it with the center letter exists
  //if the high score entry for it with the center letter doesnt exist then we should create it
  //else if it does exist
  //if the user has a highscore that can be put on the leader board then we should ask them for a user id and then put their score on the leader board
  //else then we should print the high scores
}

module.exports = { highScoreCommand, addHighScore};
