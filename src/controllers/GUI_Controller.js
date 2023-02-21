// Commands class
var Commands = require("../classes/Commands.js");

// Used for documentation
const Model = require("../Model/Model.js");

// Database object created from the file specified below
var Database = new (require("../classes/Database.js"))();

class GUI_Controller {
  /**
   * Sets up the controller by passing in the Model
   * @param {Model} Model - The Model from the MVC paradigm
   */
  constructor(Model, View) {
    this.Model = Model;
    this.View = View;
  }

  /**
   * Connects to the database
   */
  setupDatabase() {
    Database.connect();
  }

  setupGUI() {
    //GetPTags(Model) = get a random from the database (Model)
  }
}

module.exports = GUI_Controller;
