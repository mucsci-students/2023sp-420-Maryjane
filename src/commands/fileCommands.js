const fs = require("fs");
const prompt = require("prompt-sync")();

/**
 * Loads a saved puzzle
 * @param {Model} Model - object used to keep track of the game/player
 * @param {string} fileName - users inputted file name
 */
function load(fileName, Model, View) {
  //check if a game is already in progress, if it is dont load a new game
  if (Model.isPuzzleOpen) {
    promptSave(Model);
  }

  // Append ".json" to the filename if it doesn't already have it
  if (!fileName.endsWith(".json")) {
    fileName += ".json";
  }

  // Check if the file exists
  if (!fs.existsSync(fileName)) {
    console.log("SpellingBee> File does not exist or invalid file name/type");
    return;
  }

  // Read the file contents
  let fileContents = fs.readFileSync(fileName, "utf-8");

  // Parse the file contents as JSON
  let parsedFile;
  try {
    parsedFile = JSON.parse(fileContents);
  } catch (e) {
    console.log("SpellingBee> File is not a valid SpellingBee JSON file");
    return;
  }

  // Check if the file is a spelling bee file
  if (
    !parsedFile.hasOwnProperty("GuessedWords") ||
    !parsedFile.hasOwnProperty("PuzzleLetters") ||
    !parsedFile.hasOwnProperty("RequiredLetter") ||
    !parsedFile.hasOwnProperty("CurrentPoints") ||
    !parsedFile.hasOwnProperty("MaxPoints") ||
    !parsedFile.hasOwnProperty("WordList")
  ) {
    console.log("SpellingBee> File is not a valid spelling bee file");
    return;
  }

  // If all checks passed, update the Model fields with the loaded data from the file
  Model.foundWords = parsedFile.GuessedWords.map((element) =>
    element.toUpperCase()
  );
  Model.pangram = parsedFile.PuzzleLetters.toUpperCase();
  Model.requiredLetter = parsedFile.RequiredLetter.toUpperCase();
  Model.userPoints = parsedFile.CurrentPoints;
  Model.possibleGuesses = parsedFile.WordList.map((element) =>
    element.toUpperCase()
  );
  Model.maxPoints = parsedFile.MaxPoints;

  let puzzle = String.prototype.concat
    .call(...new Set(Model.pangram))
    .split("");

  Model.currentPuzzle = puzzle
    .sort((a, b) => 0.5 - Math.random())
    .sort((a, b) => 0.5 - Math.random());

  Model.isPuzzleOpen = true;
  console.log("SpellingBee> File loaded successfully\n");
  console.log("Puzzle is shown below");

  View.showPuzzle(Model);
}

/**
 * Saves current puzzle
 * @param {Model} Model - object used to keep track of the game/player
 * @param {string} fileName - users inputted file name
 * @returns null
 */
function save(fileName, Model) {
  if (!Model.isPuzzleOpen) {
    console.log("SpellingBee> No puzzle open, you cannot save");
    return false;
  }

  if (fileName === "") {
    console.log("SpellingBee> File name cannot be empty");
    return false;
  }

  //{"RequiredLetter": "a", "PuzzleLetters": "acklorw", "CurrentPoints": 0, "MaxPoints": 323, "GuessedWords": [], "WordList": ["acro"]}

  if (!fs.existsSync(fileName + ".json")) {
    let table = {
      RequiredLetter: Model.requiredLetter.toLowerCase(),
      PuzzleLetters: Model.currentPuzzle
        .toString()
        .toLowerCase()
        .replace(/,/g, ""),
      CurrentPoints: Model.userPoints,
      MaxPoints: Model.maxPoints,
      GuessedWords: Model.foundWords.map((element) => element.toLowerCase()),
      WordList: Model.possibleGuesses.map((element) => element.toLowerCase()),
    };

    let jsonFile = JSON.stringify(table);

    fs.writeFileSync(fileName + ".json", jsonFile, "utf8", (err) => {
      if (err) throw err;
    });
    console.log("SpellingBee> The file has been saved!");
    Model.isPuzzleOpen = false;
    return true;
  } else {
    console.log("SpellingBee> File already exists");
    let fileName = prompt("SpellingBee> Enter a file name: ");
    while (fileName === "") {
      fileName = prompt("SpellingBee> Enter a file name: ");
    }
    this.save(fileName, Model);
  }
}

// //TODO!!! STILL IN PROGRESS (fix the method @)
// /**
//  * Saves high score
//  * @param {Model} Model - object used to keep track of the game/player
//  * @returns null
//  */
 function highScore(Model) {
//   console.log("In the for loop");
//   //let fileContents = fs.readFileSync("highScoreDict.js", "utf-8");
//   if (!Model.isPuzzleOpen) {
//     console.log("SpellingBee> No puzzle open, no high-scores available");
//     return false;
//   }
//   let fileContents = fs.readFileSync("highScoreDict.json", "utf-8");

//   //check high score dic if puzzle with current center letter exists
//   // Load the high scores from the JSON file
//   // Load the high scores from the JSON file
//   //const highScores = JSON.parse(fileContents);
//   // Parse the file contents as JSON
//   let highScores = JSON.parse(fileContents);
//   // Check if the word has high scores and if the center letter matches
//   if (
//     highScores.highscores.hasOwnProperty(Model.pangram) &&
//     highScores.highscores[Model.pangram].center_letter === Model.requiredLetter
//   ) {
//     // Check if the score is higher than any of the existing high scores
//     //TODO!! Change score (L: 153 and change to Model.currentPoints)
//     //!!NOTE: Score -> Queen Bee / currentPoints
//     //!!NOTE: Rank -> 1st-10th place on leader board
//     //!!NOTE: if the file does not exists then create it (Add this test later)
//     const scores = highScores.highscores[Model.pangram].scores;
//     for (let i = 0; i < scores.length; i++) {
//       console.log("In the for loop");
//       if (Model.CurrentPoints > scores[i].score) {
//         console.log("In the if statement");
//         // Found a high score, so add the new score at this position
//         scores.splice(i, 0, {
//           user_id: "Mitchell",
//           rank: i + 1,
//           score: Model.CurrentPoints,
//         });

//         // Update the ranks of the existing high scores
//         for (let j = i + 1; j < scores.length; j++) {
//           console.log("In the for rank loop");
//           scores[j].rank++;
//         }

//         // Save the updated high scores to the JSON file
//         // (code for saving to file not included in this example)

//         return true; // This is a new high score
//       }
//     }

//     // Score is not a high score
//     return false;
//   } else {
//     // No existing high scores for this word and center letter, so add a new high score
//     highScores.highscores[Model.pangram] = {
//       center_letter: Model.requiredLetter,
//       scores: [
//         {
//           user_id: "Jon",
//           rank: 1,
//           score: Model.CurrentPoints,
//         },
//       ],
//     };

//     // Save the updated high scores to the JSON file
//     // (code for saving to file not included in this example)

//     return true; // This is a new high score
//   }

//   //if it doesen't: prompt: "No high-scores for current puzzle, would you like to add yours"
//   //if it does: find it, check the scores, print to terminal the current score
//   //Then check if score reaches top 10:
//   // if so: then ask if they want to add high score to leaderboard
//   // else: do nothing
 }

/**
 * prompts user to save current puzzle when they try to start a new one
 * @param {Model} Model - object used to keep track of the game/player
 * @returns null
 */
function promptSave(Model) {
  let save = prompt(
    "SpellingBee> Would you like to save your current game? (yes/no) "
  );

  save = save.toString().toLowerCase();

  while (save !== "yes" && save !== "no") {
    console.log("SpellingBee> You must type either yes or no");
    save = prompt(
      "SpellingBee> Would you like to save your current game? (yes/no) "
    );
    save = save.toString().toLowerCase();
  }

  if (save === "yes") {
    let fileName = prompt("SpellingBee> Enter a file name: ");
    while (fileName === "") {
      fileName = prompt("SpellingBee> Enter a file name: ");
    }
    this.save(fileName, Model);
  } else {
    console.log("SpellingBee> The game has been discarded");
    Model.isPuzzleOpen = false;
  }
}
module.exports = { load, save, promptSave, highScore };
