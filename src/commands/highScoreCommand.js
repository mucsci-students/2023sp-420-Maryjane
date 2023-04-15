const fs = require("fs");
const prompt = require("prompt-sync")();
const fileSystem = require("./fileSystem.js");
// //TODO!!! STILL IN PROGRESS (fix the method @)
// //TODO!! Insert into puzzle alphabetical
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

   let data = fileSystem.readJSONFile("highScoreDict.json");

   //the current puzzle string in alphabetical order
   let letters = Model.currentPuzzle
     .sort()
     .join()
     .replace(/,/g, "")
     .toUpperCase();
   console.log(letters);
   //check that the puzzle
   if (!data.highscores.hasOwnProperty(letters)) {
     console.log("SpellingBee> No high-scores available for this puzzle");
     console.log(data.highscores.hasOwnProperty(letters));
     return false;
   }

   //now check that the center letter exists in the puzzle
   if (data.highscores[letters].center_letter != Model.requiredLetter) {
     console.log(
       "SpellingBee> No high-scores available for this puzzle with this center leter"
     );
     return false;
   }

   //now print the high scores
   for (let i = 0; i <= 4; i++) {
     console.log(
       "Rank: " +
         (i + 1) +
         " " +
         data.highscores[letters].scores[i].user_id +
         " " +
         data.highscores[letters].scores[i].score
     );
   }
   //Be able to display high-scores correctly
   //Rank 1 Persons Name Score
   //Rank 2 Persons Name Score
   //Etc....

   //    // Check if the word has high scores and if the center letter matches
   //    if (
   //      highScores.highscores.hasOwnProperty(Model.pangram) &&
   //      highScores.highscores[Model.pangram].center_letter === Model.requiredLetter
   //    ) {
   //     // Check if the score is higher than any of the existing high scores
   // //     //TODO!! Change score (L: 153 and change to Model.currentPoints)
   // //     //!!NOTE: Score -> Queen Bee / currentPoints
   // //     //!!NOTE: Rank -> 1st-10th place on leader board
   // //     //!!NOTE: if the file does not exists then create it (Add this test later)
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

 module.exports = {highScoreCommand};
