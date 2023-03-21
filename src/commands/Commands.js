const {load, save} = require("./fileCommands.js");
const guess = require("./guessCommands.js");
const { generateHint, generateTwoLetterHint } = require("./hintCommands.js");
const { newPuzzle, calculatePoints } = require("./newPuzzleCommands.js");
const shuffle = require("./shuffleCommands.js");
module.exports = { load, save, guess, generateHint, generateTwoLetterHint, newPuzzle, calculatePoints, shuffle };