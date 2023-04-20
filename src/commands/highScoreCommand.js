const fs = require("fs");
const prompt = require("prompt-sync")();
const fileSystem = require("./fileSystem.js");
const { forEach } = require("scrabble/englishWords.js");

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
    console.log("SpellingBee> No high-scores available for this puzzle");
    return false;
  }

  //now check that the center letter exists in the puzzle
  if (file.highscores[letters].center_letter != Model.requiredLetter) {
    console.log("SpellingBee> No high-scores available for this puzzle with this center letter");
    return false;
  }

  let highscores = "";

  // now print the high scores
  for (let i = 0; i <= 9; i++) {
    if (
      file.highscores[letters].scores[i] == undefined ||
      file.highscores[letters].scores[i].user_id == undefined
    ) {
      break;
    }
    highscores += "Rank: " +
      (i + 1) +
      " " +
      file.highscores[letters].scores[i].user_id +
      " " +
      file.highscores[letters].scores[i].score +
      "\n";
  }
  
  //console.log(highscores); // this will print the highscores to the console
  Model.highscores = highscores; // this will store the highscores in the model
  console.log(highscores);  
}

function addHighScore(Model) {
  if (!Model.isPuzzleOpen) {
    console.log("SpellingBee> No puzzle open, no high-scores available");
    return false;
  }

  let puzzle = Model.currentPuzzle
    .sort()
    .join()
    .replace(/,/g, "")
    .toUpperCase();

  let data = fs.readFileSync("highScoreDict.json");
  let highscores = JSON.parse(data);
  let centerLetterExists = false;

  // Check if the puzzle already exists in the high score file
  if (highscores.highscores.hasOwnProperty(puzzle)) {
    // Check if the center letter is the same
    if (highscores.highscores[puzzle].center_letter === Model.requiredLetter) {
      centerLetterExists = true;
    } else {
      console.log(
        "SpellingBee> No high-scores available for this puzzle with this center letter"
      );
      return false;
    }
  }

  // Check if the user's score is within the top 10 scores for the puzzle
  let scores;
  let index;
  if (!centerLetterExists) {
    // Create a new leaderboard for the puzzle with the center letter
    highscores.highscores[puzzle] = {
      center_letter: Model.requiredLetter,
      scores: [],
    };
    scores = highscores.highscores[puzzle].scores;
    index = scores.length;
  } else {
    // Get the existing leaderboard for the puzzle
    scores = highscores.highscores[puzzle].scores;
    index = scores.findIndex((s) => s.score <= Model.userPoints);
    if (index === -1) {
      index = scores.length;
    }
  }

  if (index < 10) {
    // Prompt the user for a user ID
    let userId = prompt("Please enter a user id: ");

    let newHighScore = {
      user_id: userId,
      score: Model.userPoints,
    };

    // Insert the new score into the leaderboard
    scores.splice(index, 0, newHighScore);
    scores.splice(10);

    fs.writeFileSync("highScoreDict.json", JSON.stringify(highscores, null, 2));

    console.log("SpellingBee> Your score has been added to the leaderboard:");
  } else {
    console.log(
      "SpellingBee> Your score was not high enough to be added to the leaderboard:"
    );
  }
  
  process.exit();
}
module.exports = { highScoreCommand, addHighScore };
