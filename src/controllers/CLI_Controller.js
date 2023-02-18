/**
 * Stores CLI controller class
 */

// cli object
var vorpal = require("@moleculer/vorpal")();

// Commands class
var Commands = require("../classes/Commands.js");

// Used for documentation
const Model = require("../model/Model.js");

// Database object created from the file specified below
var Database = new (require("../classes/Database.js"))();

/**
 * Controller for the CLI following the MVC model
 */
class CLI_Controller {

  /**
   * Sets up the controller by passing in the model
   * @param {Model} model - The model from the MVC paradigm
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Connects to the database
   */
  setupDatabase() {
    Database.connect();
  }

  /**
   * Setting CLI by starting vorpal and giving it functions
   */
  setupCLI() {

    let model = this.model;

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
        Commands.guess(args.input.toString(), model);
        callback();
      });

    // Generates new puzzle. At the moment, it is the same puzzle
    vorpal
      .command(
        "new-puzzle [baseWord]",
        "Start a random puzzle with or without a specified pangram(baseword)."
      )
      .alias("new")
      .action(async function (args, callback) {
        if (args.baseWord) {
          Commands.identifyBaseWord(args.baseWord.toString(), model);
        } else {
          await Commands.newPuzzle(model, Database);
        }
        callback();
      });

    // Hidden command that shows everything related to the model
    vorpal
      .command("debug", "")
      .hidden()
      .action(function (args, callback) {
        console.log(model);
        callback();
      });

    // Command to shuffle puzzle
    vorpal
      .command(
        "shuffle",
        "Shuffles the displayed guessable letters. Helps with seeing new patterns."
      )
      .action(function (args, callback) {
        Commands.shuffle(model);
        callback();
      });

    // Command to show found words
    vorpal
      .command(
        "found-words",
        "Shows the user the words they have already guessed correctly."
      )
      .action(function (args, callback) {
        Commands.showFoundWords(model);
        callback();
      });

    // Command to load the game
    vorpal
      .command("load <filename>", "Loads the specified save file.")
      .action(function (args, callback) {
        Commands.load(args.filename.toString(), model);
        callback();
      });

    // Command to save the game
    vorpal
      .command(
        "save <filename>",
        "Saves the current game. Allows user to name save files."
      )
      .action(function (args, callback) {
        Commands.save(args.filename.toString(), model);
        callback();
      });

    // Command to show user puzzle rank
    vorpal
      .command("rank", "Shows the user their puzzle rank.")
      .action(function (args, callback) {
        Commands.showPuzzleRank(model);
        callback();
      });

    //Command to show the active puzzle and required letter
    vorpal
      .command(
        "show-puzzle",
        "Shows the user the current puzzle and the required letter."
      )
      .action(function (args, callback) {
        Commands.showPuzzle(model);
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
        if (model.isPuzzleOpen) {
          Commands.promptSave(model);
        }
        process.exit();
      });
  }

}

module.exports = CLI_Controller;
