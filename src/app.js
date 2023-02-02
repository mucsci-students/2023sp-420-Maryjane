/* Entry point of the program defined by package.json */

// cli object
var vorpal = require('vorpal')();

//GameManager object created from the file specified below.
var GameManager = new (require('./classes/GameManager.js'))();

//Commands class
var Commands = require('./classes/Commands.js');

// This function will start before the cli starts. Use it to setup vars.
function setup() {
  console.log(GameManager.isPuzzleOpen);
  console.log("hello there");
}

// Call the setup method before you start interacting with the cli
setup();

//Initializes the CLI input stream and changes the text to show 
//custom text.
vorpal
  .delimiter('SpellingBee>')
  .show();

//An example custom vorpal command that uses 'duck' as the input text
//and outputs 'Wabbit' as the response.
vorpal
  .command('duck', 'Outputs "rabbit"')
  .action(function(args, callback) {
    console.log('wumbo');
    callback();
  });

// The guess command that requires the field <input>
vorpal
  .command('guess <input>', 'Allows user to input a guess')
  .action(function(args, callback) {
    Commands.guess(args.input.toString(), GameManager);
    callback();
  });


