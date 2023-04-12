const fs = require("fs");
const prompt = require("prompt-sync")();
const fileSystem = require("./fileSystem.js");
// //TODO!!! STILL IN PROGRESS (fix the method @)
// /**
//  * Saves high score to the the leaderboard
//  * @param {Model} Model - object used to keep track of the game/player
//  * @returns null
//  */
 function highScoreCommand(Model) {
   if (!Model.isPuzzleOpen) {
     console.log("SpellingBee> No puzzle open, no high-scores available");
     return false;
   }
   //Check high score dictioary if puzzle with current center letter exists
   // Load the high scores from the JSON file
   // Load the high scores from the JSON file
   //const highScores = JSON.parse(fileContents);
   // Parse the file contents as JSON
   let highScores = fileSystem.readJSONFile("highScoreDict.json");
   console.log(highScores);


   // Check if the word has high scores and if the center letter matches
   if (
     highScores.highscores.hasOwnProperty(Model.pangram) &&
     highScores.highscores[Model.pangram].center_letter === Model.requiredLetter
   ) {
    // Check if the score is higher than any of the existing high scores
//     //TODO!! Change score (L: 153 and change to Model.currentPoints)
//     //!!NOTE: Score -> Queen Bee / currentPoints
//     //!!NOTE: Rank -> 1st-10th place on leader board
//     //!!NOTE: if the file does not exists then create it (Add this test later)
    const scores = highScores.highscores[Model.pangram].scores;
    for (let i = 0; i < scores.length; i++) {
      console.log("In the for loop");
      if (Model.CurrentPoints > scores[i].score) {
        console.log("In the if statement");
        // Found a high score, so add the new score at this position
        scores.splice(i, 0, {
          user_id: "Mitchell",
          rank: i + 1,
          score: Model.CurrentPoints,
        });

        // Update the ranks of the existing high scores
        for (let j = i + 1; j < scores.length; j++) {
          console.log("In the for rank loop");
          scores[j].rank++;
        }

        // Save the updated high scores to the JSON file
        // (code for saving to file not included in this example)

        return true; // This is a new high score
      }
    }

    // Score is not a high score
    return false;
  } else {
    // No existing high scores for this word and center letter, so add a new high score
    highScores.highscores[Model.pangram] = {
      center_letter: Model.requiredLetter,
      scores: [
        {
          user_id: "Jon",
          rank: 1,
          score: Model.CurrentPoints,
        },
      ],
    };
    // Save the updated high scores to the JSON file
    // (code for saving to file not included in this example)

    return true; // This is a new high score
  }

  //if it doesen't: prompt: "No high-scores for current puzzle, would you like to add yours"
  //if it does: find it, check the scores, print to terminal the current score
  //Then check if score reaches top 10:
  // if so: then ask if they want to add high score to leaderboard
  // else: do nothing
 }

 module.exports = {highScoreCommand};
