/* Entry point of the program defined by package.json */

/*****************************************************************************/
/*                                Global Vars                                */
/*****************************************************************************/

// Model object created from the file specified below.
const Model = new (require("./model/Model.js"))();

// CLI_Controller Object
const CLI_ControllerClass = require("./controllers/CLI_Controller.js");

// CLI_View Object
const CLI_ViewClass = require("./views/CLI_View.js");

/*****************************************************************************/
/*                                Setup Function                             */
/*****************************************************************************/

//Initialize start up logo
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

//Initialize start up description
console.log(
  "\x1b[33m%s\x1b[0m",
  "Welcome to Spelling BEE! A game all about Words and Honey.\nType new-puzzle to begin a new puzzle\nor\nFor more info type help"
);

// This function will start before the cli starts. Use it to setup MVC.
function setup() {
  // Create CLI view
  let CLI_View = new CLI_ViewClass();

  // Create CLI controller
  let CLI_Controller = new CLI_ControllerClass(Model, CLI_View);

  Model.database.connect();
  CLI_Controller.setupCLI();
}

// Call the setup method before you start interacting with the cli
setup();
