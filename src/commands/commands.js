const { load, save, promptSave } = require("./fileCommands.js");
const guess = require("./guessCommands.js");
const { generateHint, generateTwoLetterHint } = require("./hintCommands.js");
const { newPuzzle, calculatePoints, newPuzzleFromBase } = require("./newPuzzleCommands.js");
const shuffle = require("./shuffleCommands.js");
module.exports = { load, save, promptSave, guess, generateHint, generateTwoLetterHint, newPuzzle, calculatePoints,newPuzzleFromBase, shuffle };
