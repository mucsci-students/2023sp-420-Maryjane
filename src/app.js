/* Entry point of the program defined by package.json */

// cli object
var vorpal = require('vorpal')();

//GameManager object
var GameManager = new (require('./classes/GameManager.js'))();

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


