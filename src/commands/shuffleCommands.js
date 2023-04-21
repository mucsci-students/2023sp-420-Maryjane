/**
 * shuffles the current games letter order.
 * @param {Model} Model - object used to keep track of the game/player
 * @param {*} View -
 * @returns 
 */
function shuffle(Model, View) {
  if (!Model.isPuzzleOpen) {
    console.log("No puzzle in progress");
    return;
  }

  Model.shufflePuzzle();

  View.showPuzzle(Model);
}

module.exports = shuffle;
