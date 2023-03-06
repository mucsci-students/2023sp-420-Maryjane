/**
 * Stores CLI Controller class
 */
const Vorpal = require("@moleculer/Vorpal")();

const { promptSave } = require("../classes/Commands.js");
// Commands class
const Commands = require("../classes/Commands.js");

// Used for documentation
const Model = require("../Model/Model.js");

/**
 * Controller for the CLI following the MVC Model
 */
class CLI_Controller {

  /**
   * Sets up the controller by passing in the Model
   * @param {Model} Model - The Model from the MVC paradigm
   */
  constructor(Model, View) {
    this.Model = Model;
    this.View = View;
  }

  /**
   * Setting CLI by starting Vorpal and giving it functions
   */
  setupCLI() {

    let Model = this.Model;
    let View = this.View;

    //Initializes the CLI input stream and changes the text to show
    //custom text.
    Vorpal.delimiter("SpellingBee>").show();

    /*****************************************************************************/
    /*                                Vorpal Commands                            */
    /*****************************************************************************/

    //An example custom Vorpal command that uses 'duck' as the input text
    //and outputs 'Wabbit' as the response.
    Vorpal
      .command("duck", 'Outputs "wumbo", is a example command for testing.')
      .hidden()
      .action(function (args, callback) {
        console.log("wumbo");
        callback();
      });

    // The guess command that requires the field <input>
    Vorpal
      .command(
        "guess <input>",
        "Command to let user to submit the following word as a guess."
      )
      .alias("g")
      .action(function (args, callback) {
        Commands.guess(args.input.toString(), Model, View);
        callback();
      });

    // Generates new puzzle. At the moment, it is the same puzzle
    Vorpal
      .command(
        "new-puzzle [baseWord]",
        "Start a random puzzle with or without a specified pangram(baseword)."
      )
      .alias("new")
      .action(async function (args, callback) {
        if (args.baseWord) {
          Commands.identifyBaseWord(args.baseWord.toString(), Model, View);
        } else {
         Commands.newPuzzle(Model, Model.database, View);
        }
        callback();
      });

    // Hidden command that shows everything related to the Model
    Vorpal
      .command("debug", "")
      .hidden()
      .action(function (args, callback) {
        console.log(Model);
        callback();
      });

    // Command to shuffle puzzle
    Vorpal
      .command(
        "shuffle",
        "Shuffles the displayed guessable letters. Helps with seeing new patterns."
      )
      .action(function (args, callback) {
        Commands.shuffle(Model, View);
        callback();
      });

    // Command to show found words
    Vorpal
      .command(
        "found-words",
        "Shows the user the words they have already guessed correctly."
      )
      .action(function (args, callback) {
        View.showFoundWords(Model);
        callback();
      });

    // Command to load the game
    Vorpal
      .command("load <filename>", "Loads the specified save file.")
      .action(function (args, callback) {
        Commands.load(args.filename.toString(), Model, View);
        callback();
      });

    // Command to save the game
    Vorpal
      .command(
        "save <filename>",
        "Saves the current game. Allows user to name save files."
      )
      .action(function (args, callback) {
        Commands.save(args.filename.toString(), Model);
        callback();
      });

    // Command to show user puzzle rank
    Vorpal
      .command("rank", "Shows the user their puzzle rank.")
      .action(function (args, callback) {
        View.showPuzzleRank(Model);
        callback();
      });

    //Command to show the active puzzle and required letter
    Vorpal
      .command(
        "show-puzzle",
        "Shows the user the current puzzle and the required letter."
      )
      .action(function (args, callback) {
        View.showPuzzle(Model);
        callback();
      });

    /*****************************************************************************/
    /*                                Exit Function                              */
    /*****************************************************************************/

    // Command to Exit
    Vorpal.find("exit").remove();

    Vorpal
      .command("exit", "Exits the program gracefully.")
      .alias("quit")
      .action(function (args, callback) {
        if (Model.isPuzzleOpen) {
          Commands.promptSave(Model);
        }
        process.exit();
      });
  }

}

module.exports = CLI_Controller;
