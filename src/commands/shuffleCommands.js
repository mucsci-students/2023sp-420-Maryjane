/**
 * shuffles the current games letter order.
 * @param {Model} Model - object used to keep track of the game/player
 * @param {*} View -
 * @returns 
 */
function shuffle(Model, View) {
  if (!Model.isPuzzleOpen) {
    console.log("game is not in progess");
    return;
  }

  // Converts pangram into array of letters
  Model.currentPuzzle = Model.currentPuzzle
    .sort((a, b) => 0.5 - Math.random())
    .sort((a, b) => 0.5 - Math.random());

  View.showPuzzle(Model);
}
module.exports = shuffle;