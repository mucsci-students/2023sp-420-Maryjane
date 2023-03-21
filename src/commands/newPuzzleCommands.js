const isWord = require("../dict.js");
const MongoDB = require("../database/lib/mongodb.js");

/**
   * Generates a new puzzle. At the moment, it is always the same puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @param {MongoDB} MongoDB - object used to keep track of the game/player
   * @returns null
   */
function newPuzzle(Model, MongoDB, View) {
    if (Model.isPuzzleOpen) {
        //CLI case
        if (typeof window === "undefined") {
            this.promptSave(Model);
        }
    }

    let pangram = MongoDB.getRandomWord();
    pangram = pangram.toUpperCase();

    // Converts pangram into array of letters
    let pangramLetters = String.prototype.concat
        .call(...new Set(pangram))
        .split("");
    Model.currentPuzzle = pangramLetters
        .sort((a, b) => 0.5 - Math.random())
        .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["J", "Q", "X", "Z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
        (element) => !toRemove.includes(element)
    );

    Model.isPuzzleOpen = true;
    Model.pangram = pangram;
    Model.requiredLetter =
        pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    Model.maxPoints = 0;

    Model.possibleGuesses = scrabble(
        (pangram + pangram + pangram).toLowerCase()
    ).filter((element) => {
        return (
            element.length >= 4 &&
            element.includes(Model.requiredLetter.toLowerCase())
        );
    });

    Model.possibleGuesses.forEach((element) => {
        Model.maxPoints += Commands.calculatePoints(element, Model);
    });

    View.showSuccessMessage("New puzzle started below! ");
    Model.userPoints = 0;
    Model.foundWords = [];
    View.showPuzzle(Model);
}

/**
   * Uses the algorithm that the SpellingBee.org website uses to update the players rank/score.
   * @param {String} word - the user guess
   * @param {Model} Model - the Model object
   */
function calculatePoints(word, Model) {
    //Shifts it, so you get 1 point for a 4-letter word, 2 points for 5 letters, etc.
    let score = 0;
    let USED_ALL_LETTERS_BONUS = 7;

    if (word.length === 4) {
        score += 1;
    } else {
        score += word.length;
    }

    // If word is the current pangram on any pangram
    if (
        word === Model.pangram ||
        String.prototype.concat.call(...new Set(word)).split("").length === 7
    ) {
        score += USED_ALL_LETTERS_BONUS;
    }

    return score;
}

/**
   * Generates a new puzzle based on user inputted word
   * @param {Model} Model - object used to keep track of the game/player
   * @param {string} input - users inputted word
   * @returns
   */
function newPuzzleFromBase(input, Model, View) {
    if (input === null || input === undefined) {
        View.showErrorMessage("No input");
        return;
    } else if (input.length < 7) {
        View.showErrorMessage("Word must be at least 7 characters");
        return;
    }

    input = input + "";
    input = input.toUpperCase();

    if (Model.isPuzzleOpen) {
        //CLI case
        if (typeof window === "undefined") {
            this.promptSave(Model);
        }
    }
    // Checks user's word to have correct length and no spaces
    if (String.prototype.concat.call(...new Set(input)).length !== 7) {
        View.showErrorMessage(
            "The new word must have 7 unique letters and no spaces"
        );
        return;
    }

    //Checks user's word to be an actual word in the dictionary
    if (!isWord(input)) {
        View.showErrorMessage(input + " was not found in the dictionary");
        return;
    }

    let pangram = input;
    pangram = pangram.toUpperCase();

    // Converts pangram into array of letters
    let pangramLetters = String.prototype.concat
        .call(...new Set(pangram))
        .split("");
    Model.currentPuzzle = pangramLetters
        .sort((a, b) => 0.5 - Math.random())
        .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["J", "Q", "X", "Z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
        (element) => !toRemove.includes(element)
    );

    Model.isPuzzleOpen = true;
    Model.pangram = pangram;
    Model.requiredLetter =
        pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    Model.maxPoints = 0;

    Model.possibleGuesses = scrabble(
        (pangram + pangram + pangram).toLowerCase()
    ).filter((element) => {
        return (
            element.length >= 4 &&
            element.includes(Model.requiredLetter.toLowerCase())
        );
    });

    Model.possibleGuesses.forEach((element) => {
        Model.maxPoints += Commands.calculatePoints(element, Model);
    });

    View.showSuccessMessage("New puzzle started below! ");
    Model.userPoints = 0;
    Model.foundWords = [];
    View.showPuzzle(Model);
}

module.exports = newPuzzle, calculatePoints;