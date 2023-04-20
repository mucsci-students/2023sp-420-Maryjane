/**
 * Stores CLI Controller class
 */
const Vorpal = require("@moleculer/Vorpal")();

// Commands class
const Commands = require("../commands/commands.js");

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

    // An example custom Vorpal command that uses 'duck' as the input text
    // and outputs 'Wabbit' as the response.
    // Vorpal.command("duck", 'Outputs "wumbo", is a example command for testing.')
    //   .hidden()
    //   .action(function (args, callback) {
    //     console.log("wumbo");
    //     callback();
    //   });

    // The guess command that requires the field <input>
    Vorpal.command(
      "guess <input>",
      "Command to let user to submit the following word as a guess."
    )
      .alias("g")
      .action(function (args, callback) {
        Commands.guess(args.input.toString(), Model, View);
        callback();
      });

    // Generates new puzzle. At the moment, it is the same puzzle
    Vorpal.command(
      "new-puzzle [baseWord]",
      "Start a random puzzle with or without a specified pangram(baseword)."
    )
      .alias("new")
      .action(async function (args, callback) {
        if (args.baseWord) {
          Commands.newPuzzleFromBase(args.baseWord.toString(), Model, View);
        } else {
          Commands.newPuzzle(Model, Model.database, View);
        }
        callback();
      });

    //Hidden command that shows everything related to the Model
    Vorpal.command("debug", "")
      .hidden()
      .action(function (args, callback) {
        console.log(Model);
        callback();
      });

    // Command to shuffle puzzle
    Vorpal.command(
      "shuffle",
      "Shuffles the displayed guessable letters. Helps with seeing new patterns."
    ).action(function (args, callback) {
      Commands.shuffle(Model, View);
      callback();
    });

    // Command to show found words
    Vorpal.command(
      "found-words",
      "Shows the user the words they have already guessed correctly."
    ).action(function (args, callback) {
      View.showFoundWords(Model);
      callback();
    });

    // Command to load the game
    Vorpal.command("load <filename>")
      .option('-d', 'for decrypting encrypted files.')
      .description("Loads the specified save file.")
      .action(
        function (args, callback) {
          if (args.options.d) {
            Commands.load(args.filename.toString(), Model, View, 1);
          } else {
            Commands.load(args.filename.toString(), Model, View, 0);
          }
          callback();
        }
      );

    // Command to save the game
    Vorpal.command(
      "save <filename>",
    ).option('-e', 'for encrypting the save file.')
      .description("Saves the current game. Allows user to name save files.")
      .action(function (args, callback) {
        if (args.options.e) {
          Commands.save(args.filename.toString(), Model, 1);
        } else {
          Commands.save(args.filename.toString(), Model, 0);
        }
        callback();
      });

    // Command to show user puzzle rank
    Vorpal.command("rank", "Shows the user their puzzle rank.").action(
      function (args, callback) {
        View.showPuzzleRank(Model);
        callback();
      }
    );

    //Command to show the active puzzle and required letter
    Vorpal.command(
      "show-puzzle",
      "Shows the user the current puzzle and the required letter."
    ).action(function (args, callback) {
      View.showPuzzle(Model);
      callback();
    });

    //Command to show the hint grid and 2 words list
    Vorpal.command(
      "hint",
      "Shows the user the current puzzle's hints and bingo."
    ).action(function (args, callback) {
      Commands.generateHint(Model, View);
      callback();
    });

    //Command to allow high-score to be saved
    Vorpal.command(
      "view-high-scores",
      "Shows the current highscores for current puzzle"
    ).action(function (args, callback) {
      Commands.highScoreCommand(Model);
      callback();
    });

    //!!! Change to other function when done
    //Command to allow high-score to be saved
    Vorpal.command(
      "add-high-score",
      "Ends the current game and adds highscore to leader board if high enough"
    ).action(function (args, callback) {
      Commands.addHighScore(Model);
      callback();
    });

    Vorpal.command(
      "share-img",
      "Saves a shareable image to your computer"
    ).action(function (args, callback) {
      View.shareImg(Model);
      callback();
    });

    /*****************************************************************************/
    /*                                Exit Function                              */
    /*****************************************************************************/

    // Command to Exit
    Vorpal.find("exit").remove();

    Vorpal.command("exit", "Exits the program gracefully.")
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
