/* Entry point of the program defined by package.json */

/*****************************************************************************/
/*                                Global Vars                                */
/*****************************************************************************/

// cli object
var vorpal = require("@moleculer/vorpal")();

//GameManager object created from the file specified below.
var GameManager = new (require("./classes/GameManager.js"))();

//Commands class
var Commands = require("./classes/Commands.js");

//Database object created from the file specified below
var Database = new (require("./classes/Database.js"))();

/*****************************************************************************/
/*                                Setup Function                             */
/*****************************************************************************/

// This function will start before the cli starts. Use it to setup vars.
async function setup() {
  await Database.connect();
}

// Call the setup method before you start interacting with the cli
setup();

/*****************************************************************************/
/*                                CLI Initializtion                          */
/*****************************************************************************/

//Initializes the CLI input stream and changes the text to show
//custom text.
vorpal.delimiter("SpellingBee>").show();

/*****************************************************************************/
/*                                Vorpal Commands                            */
/*****************************************************************************/

//An example custom vorpal command that uses 'duck' as the input text
//and outputs 'Wabbit' as the response.
vorpal.command("duck", 'Outputs "wumbo", is a example command for testing.').hidden().action(function (args, callback) {
  console.log("wumbo");
  callback();
});

// The guess command that requires the field <input>
vorpal
  .command("guess <input>", "Command to let user to submit the following word as a guess.")
  .action(function (args, callback) {
    Commands.guess(args.input.toString(), GameManager);
    callback();
  });

// Generates new puzzle. At the moment, it is the same puzzle
vorpal
  .command("new-puzzle [baseWord]", "Start a random puzzle with or without a specified pangram(baseword).")
  .alias("new")
  .action(function (args, callback) {
    if (args.baseWord) {
      Commands.identifyBaseWord(args.baseWord.toString(), GameManager);
    } 
    else {
      Commands.newPuzzle(GameManager, Database);
    }
    callback();
  });

// Hidden command that shows everything related to the gamemanager
vorpal
  .command("debug", "")
  .hidden()
  .action(function (args, callback) {
    console.log(GameManager);
    callback();
  });

// Command to shuffle puzzle
vorpal
  .command("shuffle", "Shuffles the displayed guessable letters. Helps with seeing new patterns.")
  .action(function (args, callback) {
    Commands.shuffle(GameManager);
    callback();
  });

// Command to show found words
vorpal
  .command("found-words", "Shows the user the words they have already guessed correctly.")
  .action(function (args, callback) {
    Commands.showFoundWords(GameManager);
    callback();
  });

// Command to load the game
vorpal
  .command("load <filename>", "Loads the specified save file.")
  .action(function (args, callback) {
    Commands.load(args.filename.toString(), GameManager);
    callback();
  });

// Command to save the game
vorpal
  .command("save <filename>", "Saves the current game. Allows user to name save files.")
  .action(function (args, callback) {
    Commands.save(args.filename.toString(), GameManager);
    callback();
  });

// Command to show user puzzle rank
vorpal
  .command('rank', 'Shows the user their puzzle rank.')
  .action(function(args, callback) {
    Commands.showPuzzleRank(GameManager);
    callback();
  });

  //Command to show the active puzzle and required letter
vorpal
.command('show-puzzle', 'Shows the user the current puzzle and the required letter.')
.action(function(args, callback) {
  Commands.showPuzzle(GameManager);
  callback();
});

/*****************************************************************************/
/*                                Exit Function                              */
/*****************************************************************************/

// Command to Exit
vorpal.find("exit").remove();

vorpal
  .command("exit", "Exits the program gracefully.")
  .action(function (args, callback) {
    if (GameManager.isPuzzleOpen) {
      Commands.promptSave(GameManager);
    }
    process.exit();
  });

