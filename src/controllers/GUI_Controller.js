// Commands class
var Commands = require("../classes/Commands.js");

// Used for documentation
const Model = require("../model/Model.js");

class GUI_Controller {
  /**
   * Sets up the controller by passing in the Model
   * @param {Model} Model - The Model from the MVC paradigm
   */
  constructor(Model, View) {
    this.Model = Model;
    this.View = View;
  }

  setupGUI() {
    //GetPTags(Model) = get a random from the database (Model)
  }

  handleShuffleClick() {
    Commands.shuffle(this.Model, this.View);
  }

}

module.exports = GUI_Controller;
