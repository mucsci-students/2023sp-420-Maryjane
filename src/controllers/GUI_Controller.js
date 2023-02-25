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
    this.setupController();
  }

  setupController() {

    window.addEventListener("click", (event) => {
      this.View.focusOnInputField();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.View.getEnterBtn();
      }
    });

  }

  handleShuffleClick() {
    Commands.shuffle(this.Model, this.View);
  }
  
  handleDeleteClick() {
    this.View.getDeleteBtn();
  }

  handleHexClick(i) {
    this.View.getButtonClick(i);
  }

  handleEnterClick() {
    this.View.getEnterBtn();
  }
}

module.exports = GUI_Controller;
