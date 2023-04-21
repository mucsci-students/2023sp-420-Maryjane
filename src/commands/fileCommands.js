const fs = require("fs");
const prompt = require("prompt-sync")();
const crypto = require('crypto');



const key = Buffer.from('5f733b441fa2a01b17d5f98e9f7cfeeb2b1e22c548baa83d062e3ab1b8c06a32', 'hex');
const iv = Buffer.from('b8c30f7a1d72e1aebc100e8a0d7ba504', 'hex');

/**
   * Loads a saved puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @param {string} fileName - users inputted file name
   */
function load(fileName, Model, View, shouldDecrypt) {

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
  Model.maxPoints = parsedFile.MaxPoints;

try {
  if (shouldDecrypt) {


    // the encrypted JSON string and key/IV from earlier
    const encrypted = parsedFile.WordList;
    const key2 = Buffer.from(key, 'hex');
    const iv2 = Buffer.from(iv, 'hex');

    // create a decipher object with the key and IV
    const decipher = crypto.createDecipheriv('aes-256-cbc', key2, iv2);

    // decrypt the encrypted data
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // parse the decrypted JSON string back into an object
    const json = JSON.parse(decrypted);

    // output the decrypted JSON object
    // console.log('Decrypted JSON:', json);
    Model.possibleGuesses = json;
  } else {
    Model.possibleGuesses = parsedFile.WordList.map((element) => element.toUpperCase());
  }
} catch (error) {
  console.log("Problem loading file. Most likely trying to load an encrypted file without proper arguments.");
  return;
}
  

  let puzzle = String.prototype.concat
    .call(...new Set(Model.pangram))
    .split("");

  Model.currentPuzzle = puzzle;
  Model.shufflePuzzle();

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
function save(fileName, Model, shouldEncrypt) {

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

    // convert JSON to string
    const jsonStr = JSON.stringify(Model.possibleGuesses);

    // generate a random 256-bit key and 128-bit initialization vector (IV)


    // create a cipher object with the key and IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    // console.log(jsonStr);

    // encrypt the JSON string
    let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // output the encrypted data and key/IV (for decryption later)
    // console.log('Encrypted data:', encrypted);
    // console.log('Key:', key.toString('hex'));
    // console.log('IV:', iv.toString('hex'));

    let table = {
      RequiredLetter: Model.requiredLetter.toLowerCase(),
      PuzzleLetters: Model.currentPuzzle
        .toString()
        .toLowerCase()
        .replace(/,/g, ""),
      CurrentPoints: Model.userPoints,
      MaxPoints: Model.maxPoints,
      GuessedWords: Model.foundWords.map((element) => element.toLowerCase()),

      //cracked use of ternary operator (?) !!! lol -Michael
      WordList: shouldEncrypt ? encrypted : Model.possibleGuesses.map((element) => element.toLowerCase())
    };
    // console.log(atob(table.WordList));
    // console.log(table.WordList);


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
module.exports = { load, save, promptSave };
