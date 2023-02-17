// Import the ckeck word class for validating user guesses
const wordsClass = require("check-word");
const Database = require("./Database");
const GameManager = require("./GameManager");

const prompt = require('prompt-sync')();

// dictionary object used to check whether a word is valid or not
const dictionary = wordsClass("en");

//file system module
const fs = require("fs");
const { LongWithoutOverridesClass } = require("bson");

/**
 * Commands class used to store static helper methods for the cli.
 */
class Commands {
  /**
   * Used to check if a users guess is valid. If it is, the word gets inserted into GameManager.foundWords
   * @param {string} input - The input/guess the user made.
   * @param {GameManager} GameManager - The gamemanager object used to keep track of the game
   * @returns a bool that is true if the guess was valid and inserted, false if not
   */
  static guess(input, GameManager) {
    //Converts input to a string
    input = input + "";
    input = input.toLowerCase();

    if (!GameManager.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return false;
    }

    if (input.length < 4) {
      console.log("Guess must be at least 4 characters");
      return false;
    }

    // Check that the input has the required lettter
    if (input.search(GameManager.requiredLetter.toLowerCase()) === -1) {
      console.log(
        "Guess must contain required character\nThe required character is",
        GameManager.requiredLetter
      );
      return false;
    }

    // Check that all letters of the input are allowed letters determined by the pangram
    for (let i = 0; i < input.length; i++) {
      if (GameManager.pangram.search(input.charAt(i)) === -1) {
        console.log(input.charAt(i) + " is not in the required letters");
        return false;
      }
    }

    // Check that guess is not in the found words
    if (GameManager.foundWords.includes(input)) {
      console.log("Invalid, " + input + " was already guessed");
      return false;
    }

    // Check that the guess is a real word
    if (!dictionary.check(input)) {
      console.log(input + " was not found in the dictionary");
      return false;
    }

    // Insert the guess into list of found words and increase user points
    GameManager.foundWords.push(input);

    Commands.updatePuzzleRank(input, GameManager);

    console.log("success");

    return true;
  }

  /**
   * Generates a new puzzle. At the moment, it is always the same puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {Database} Database - object used to keep track of the game/player
   * @returns null
   */
  static async newPuzzle(GameManager, Database) {
    if (GameManager.isPuzzleOpen) {
      console.log("game is in progess");
      this.promptSave(GameManager);
    }

    let pangram = await Database.getRandomWord();

    // Converts pangram into array of letters
    let pangramLetters = pangram.split("");
    GameManager.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["j", "q", "x", "z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
      (element) => !toRemove.includes(element)
    );

    GameManager.isPuzzleOpen = true;
    GameManager.pangram = pangram;
    GameManager.requiredLetter =
      pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    console.log("New puzzle started below! ");

    this.showPuzzle(GameManager);
  }

  /**
   * Uses the algorithm that the SpellingBee.org website uses to update the players rank/score.
   * @param {String} word - the user guess
   * @param {GameManager} GameManager - the gamemanager object
   */
  static updatePuzzleRank(word, GameManager) {
    //Shifts it so you get 1 point for a 4 letter word, 2 points for 5 letters, etc.
    let score = word.length - 3;
    let USED_ALL_LETTERS_BONUS = 7;

    if (word === GameManager.pangram) {
      score += USED_ALL_LETTERS_BONUS;
    }

    GameManager.userPoints += score;
  }

  /**
   * Displays the users currect
   * @param {GameManager} GameManager - GameMangager object used to check if puzzle is open and to show the puzzle rank
   * @returns null
   */
  static showPuzzleRank(GameManager) {
    if (!GameManager.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    const MAX_POINTS = 150;

    // Ranking system: https://freebee.fun/api.html

    let score = GameManager.userPoints / MAX_POINTS;

    let rank = this.#getRankName(score);

    console.log(GameManager.userPoints + `/${MAX_POINTS} points`);
    console.log("Your rank: " + rank);
  }

  /**
   * Calculates the users rank name based on scorePercentage
   * @param {number} score
   * @returns Your name as rank
   */
  static #getRankName(score) {            //Maybe make this a switch statement sometime? -Michael
    if (score < 0.02) {
      return "Newbie";
    } else if (score < 0.05) {
      return "Novice";
    } else if (score < 0.08) {
      return "Fine";
    } else if (score < 0.15) {
      return "Skilled";
    } else if (score < 0.25) {
      return "Excellent";
    } else if (score < 0.4) {
      return "Superb";
    } else if (score < 0.5) {
      return "Marvellous";
    } else if (score < 0.7) {
      return "Outstanding";
    } else if (score <= 1) {
      return "Queen Bee";
    }

    return "Something went wrong";
  }

  static async shuffle(GameManager) {
    if (!GameManager.isPuzzleOpen) {
      console.log("game is not in progess");
      return;
    }

    let pangram = GameManager.pangram;
    let pangramLetters = pangram.split("");

    // Converts pangram into array of letters
    GameManager.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());


    this.showPuzzle(GameManager);
  }

  /**
   * Generates a new puzzle based on user inputted word
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {input} input - users inputted word
   * @returns null
   */
  static identifyBaseWord(input, GameManager) {
    input = input + "";
    input = input.toLowerCase();

    if (GameManager.isPuzzleOpen) {
      console.log("game is in progess");
      this.promptSave(GameManager);
    }
    // Checks user's word to have correct length and no spaces
    if (String.prototype.concat.call(...new Set(input)).length != 7) {
      console.log("The new word must have 7 unique letters and no spaces");
      return;
    }
    // remove duplicate letters from input

    // Checks user's word to be an actual word in the dictionary
    if (!dictionary.check(input)) {
      console.log(input + " was not found in the dictionary");
      return;
    }

    // Converts pangram into array of letters
    let pangram = input;
    let pangramLetters = String.prototype.concat.call(...new Set(input)).split("");
    GameManager.currentPuzzle = pangramLetters
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());

    // Method will not choose these letters when finding random required letter
    let toRemove = ["j", "q", "x", "z"];

    // Filter out letters from above
    pangramLetters = pangramLetters.filter(
      (element) => !toRemove.includes(element)
    );

    GameManager.isPuzzleOpen = true;
    GameManager.pangram = pangram;
    GameManager.requiredLetter =
      pangramLetters[Math.floor(Math.random() * pangramLetters.length)];

    this.showPuzzle(GameManager);
  }

  /**
   * Shows current found word in puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @returns null
   */
  static showFoundWords(GameManager) {
    // If no current puzzle
    if (!GameManager.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    // If no words found yet
    if (GameManager.foundWords.length <= 0) {
      console.log("No words found");
      return;
    }

    console.log(GameManager.foundWords);
  }

  /**
   * Shows the current puzzle and the required letter
   * @param {*} GameManager
   * @returns null
   */
  static showPuzzle(GameManager) {
    // If no current puzzle
    if (!GameManager.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    //prints out the currnet puzzle and the required letter in the console
    console.log("Use the letters below to make a guess");

    //check where required letter is in array
    if (GameManager.currentPuzzle[3] != GameManager.requiredLetter) {
      for (let index = 0; index < 7; index++) {
        const element = GameManager.currentPuzzle[index];
        if (element == GameManager.requiredLetter) {
          //swaps where required letter is to the center of the array
          [GameManager.currentPuzzle[index], GameManager.currentPuzzle[3]] = [GameManager.currentPuzzle[3], GameManager.currentPuzzle[index]]
        }
      }
    }

    var normalStyle = ["color: white"];
    var requiredStyle = ["color: red"];
    var reqLetter = GameManager.currentPuzzle[3];
    console.log("%c    %s       %s\n\n%s    %c>> %s <<%c    %s\n\n    %s       %s", normalStyle, GameManager.currentPuzzle[0], GameManager.currentPuzzle[1], GameManager.currentPuzzle[2], requiredStyle, reqLetter, normalStyle, GameManager.currentPuzzle[4], GameManager.currentPuzzle[5], GameManager.currentPuzzle[6]);
  }

  /**
   * Loads a saved puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {fileName} fileName - users inputted file name
   */
  static load(fileName, GameManager) {
    //check if a game is already in progress, if it is dont load a new game
    if (GameManager.isPuzzleOpen) {
      this.promptSave(GameManager);
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
      !parsedFile.hasOwnProperty("words") ||
      !parsedFile.hasOwnProperty("pangram") ||
      !parsedFile.hasOwnProperty("requiredLetter") ||
      !parsedFile.hasOwnProperty("userPoints")
    ) {
      console.log("SpellingBee> File is not a valid spelling bee file");
      return;
    }

    // If all checks passed, update the GameManager fields with the loaded data from the file
    GameManager.foundWords = parsedFile.words;
    GameManager.pangram = parsedFile.pangram;
    GameManager.requiredLetter = parsedFile.requiredLetter;
    GameManager.userPoints = parsedFile.userPoints;
    let puzzle = GameManager.pangram.split("")
    GameManager.currentPuzzle = puzzle
      .sort((a, b) => 0.5 - Math.random())
      .sort((a, b) => 0.5 - Math.random());
    GameManager.isPuzzleOpen = true;
    console.log("SpellingBee> File loaded successfully\n");
    console.log("Puzzle is shown below");

    this.showPuzzle(GameManager);
  }

  /**
   * Saves current puzzle
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @param {fileName} fileName - users inputted file name
   * @returns null
   */
  static save(fileName, GameManager) {
    if (!GameManager.isPuzzleOpen) {
      console.log("SpellingBee> No puzzle open, you can not save");
      return false;
    }

    if (fileName == "") {
      console.log("SpellingBee> File name cannot be empty");
      return false;
    }

    if (!fs.existsSync(fileName + ".json")) {

      let table = {
        words: GameManager.foundWords,
        pangram: GameManager.pangram,
        requiredLetter: GameManager.requiredLetter,
        userPoints: GameManager.userPoints,
      };

      let jsonFile = JSON.stringify(table);

      fs.writeFileSync(fileName + ".json", jsonFile, "utf8", (err) => { if (err) throw err; });
      console.log("SpellingBee> The file has been saved!");
      GameManager.isPuzzleOpen = false;
      return true;
    }

    else {
      console.log("SpellingBee> File already exists");
      let fileName = prompt("SpellingBee> Enter another file name: ");
      this.save(fileName, GameManager);
      //no return value because the function will be called again
    }
  }

  /**
   * prompts user to save current puzzle when they try to start a new one
   * @param {GameManager} GameManager - object used to keep track of the game/player
   * @returns null
   */
  static promptSave(GameManager) {
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
      this.save(fileName, GameManager);
    } else {
      console.log("SpellingBee> The game has been discarded");
      GameManager.isPuzzleOpen = false;
    }
  }
}

module.exports = Commands;
