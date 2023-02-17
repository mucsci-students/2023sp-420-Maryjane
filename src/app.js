/* Entry point of the program defined by package.json */

/*****************************************************************************/
/*                                Global Vars                                */
/*****************************************************************************/

// cli object
var vorpal = require("@moleculer/vorpal")();

// Model object created from the file specified below.
var Model = new (require("./model/Model.js"))();

// Commands class
var Commands = require("./classes/Commands.js");

// Database object created from the file specified below
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

//Initilize start up logo
console.log(
  "\x1b[33m%s\x1b[0m",
  "  ,-.                                                                             ,-."
);
console.log(
  "\x1b[33m%s\x1b[0m",
  "  \\_/   .   ..  . .      .   S  P  E  L  L  I  N  G   .    ..      . .      .     \\_/"
);
console.log(
  "\x1b[33m%s\x1b[0m",
  " {|||)< . .   ..     ..          B     E     E           ..   ..     ..         >(|||}"
);
console.log(
  "\x1b[33m%s\x1b[0m",
  "  / \\                                                                             / \\"
);
console.log(
  "\x1b[33m%s\x1b[0m",
  "  `-'                                                                             `-'"
);

//Intilize start up description
console.log(
  "\x1b[33m%s\x1b[0m",
  "Welcome to Spelling BEE! A game all about Words and Honey.\nType new-puzzle to begin a new puzzle\nor\nFor more info type help"
);
//Initializes the CLI input stream and changes the text to show
//custom text.
vorpal.delimiter("SpellingBee>").show();

/*****************************************************************************/
/*                                Vorpal Commands                            */
/*****************************************************************************/

//An example custom vorpal command that uses 'duck' as the input text
//and outputs 'Wabbit' as the response.
vorpal
  .command("duck", 'Outputs "wumbo", is a example command for testing.')
  .hidden()
  .action(function (args, callback) {
    console.log("wumbo");
    callback();
  });

// The guess command that requires the field <input>
vorpal
  .command(
    "guess <input>",
    "Command to let user to submit the following word as a guess."
  )
  .action(function (args, callback) {
    Commands.guess(args.input.toString(), Model);
    callback();
  });

// Generates new puzzle. At the moment, it is the same puzzle
vorpal
  .command(
    "new-puzzle [baseWord]",
    "Start a random puzzle with or without a specified pangram(baseword)."
  )
  .alias("new")
  .action(function (args, callback) {
    if (args.baseWord) {
      Commands.identifyBaseWord(args.baseWord.toString(), Model);
    } else {
      Commands.newPuzzle(Model, Database);
    }
    callback();
  });

// Hidden command that shows everything related to the Model
vorpal
  .command("debug", "")
  .hidden()
  .action(function (args, callback) {
    console.log(Model);
    callback();
  });

// Command to shuffle puzzle
vorpal
  .command(
    "shuffle",
    "Shuffles the displayed guessable letters. Helps with seeing new patterns."
  )
  .action(function (args, callback) {
    Commands.shuffle(Model);
    callback();
  });

// Command to show found words
vorpal
  .command(
    "found-words",
    "Shows the user the words they have already guessed correctly."
  )
  .action(function (args, callback) {
    Commands.showFoundWords(Model);
    callback();
  });

// Command to load the game
vorpal
  .command("load <filename>", "Loads the specified save file.")
  .action(function (args, callback) {
    Commands.load(args.filename.toString(), Model);
    callback();
  });

// Command to save the game
vorpal
  .command(
    "save <filename>",
    "Saves the current game. Allows user to name save files."
  )
  .action(function (args, callback) {
    Commands.save(args.filename.toString(), Model);
    callback();
  });

// Command to show user puzzle rank
vorpal
  .command("rank", "Shows the user their puzzle rank.")
  .action(function (args, callback) {
    Commands.showPuzzleRank(Model);
    callback();
  });

//Command to show the active puzzle and required letter
vorpal
  .command(
    "show-puzzle",
    "Shows the user the current puzzle and the required letter."
  )
  .action(function (args, callback) {
    Commands.showPuzzle(Model);
    callback();
  });

/*****************************************************************************/
/*                                Exit Function                              */
/*****************************************************************************/

// Command to Exit
vorpal.find("exit").remove();

vorpal
  .command("exit", "Exits the program gracefully.")
  .alias("quit")
  .action(function (args, callback) {
    if (Model.isPuzzleOpen) {
      Commands.promptSave(Model);
    }
    process.exit();
  });
