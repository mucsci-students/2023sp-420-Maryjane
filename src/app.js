/* Entry point of the program defined by package.json */

var vorpal = require('vorpal')();

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
        this.log('Wabbit');
        callback();
      });

// ======  Commented out due to breaking added functionality.======
// function main() {
//     console.log("hello there");
    
// }

// //Invokes the main method
// if (require.main === module) {
//     main();
// }
