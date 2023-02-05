/* Entry point of the program defined by package.json */

/*****************************************************************************/
/*                                Global Vars                                */
/*****************************************************************************/

// cli object
var vorpal = require("vorpal")();

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
vorpal.command("duck", 'Outputs "rabbit"').action(function (args, callback) {
  console.log("wumbo");
  callback();
});

// The guess command that requires the field <input>
vorpal
  .command("guess <input>", "Allows user to input a guess")
  .action(function (args, callback) {
    Commands.guess(args.input.toString(), GameManager);
    callback();
  });

// Generates new puzzle. At the moment, it is the same puzzle
vorpal
  .command("new-puzzle", "Allows user to start a new puzzle")
  .action(function (args, callback) {
    Commands.newPuzzle(GameManager, Database);
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
  .command("shuffle", "Allows user to shuffle puzzle")
  .action(function (args, callback) {
    Commands.shuffle(GameManager, Database);
    callback();
  });

// Command to show found words
vorpal
  .command("show-found-words", "Allows user to show found words")
  .action(function (args, callback) {
    Commands.showFoundWords(GameManager);
    callback();
  });

// Command to save the game
vorpal
  .command("save <filename>", "Allows a user to save their game")
  .action(function (args, callback) {
    Commands.save(args.filename.toString(), GameManager);
    callback();
  });

// Command to create puzzle with user input
vorpal
  .command("identify-base-word <input>", "Allows user to choose base word")
  .action(function (args, callback) {
    Commands.identifyBaseWord(args.input.toString(), GameManager);
    callback();
  });

/*****************************************************************************/
/*                                Exit Function                              */
/*****************************************************************************/

// Node calls this function automatically when the process ends
process.on("exit", function () {
  console.log("end");
});
