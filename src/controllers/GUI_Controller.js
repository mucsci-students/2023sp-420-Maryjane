// Commands class
var Commands = require("../commands/commands.js");

// Used for documentation
const Model = require("../model/Model.js");
const Modal = require('modal-vanilla');

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
        this.handleEnterClick();
      }
    });
  }

  handleHintClick() {
    this.View.getHintBtn();
  }

  handleDarkModeClick() {
    this.View.toggleDarkMode();
  }

  handleShuffleClick() {
    Commands.shuffle(this.Model, this.View);
  }

  handleDeleteClick() {
    this.View.getDeleteBtn();
  }

  handleHexClick(i) {
    this.View.addLetterToInputField(i);
  }

  handleEnterClick() {
    this.View.getEnterBtn();
    this.View.updateRank();
  }

  handleNewPuzzleClick() {

    let database = this.Model.database;
    let Model = this.Model;
    let View = this.View;

    // Create and show save prompt
    new Modal({
      title: 'Save Prompt',
      content: 'Do you wish to save before starting a new puzzle?',
      transition: 0,
      backdropTransition: 0
    })
    .show()
    .once('dismiss', function(modal, ev, button) {

      // Clicked yes for save
      if (button && button.value) {

        let userData = {
          words: Model.foundWords,
          pangram: Model.pangram,
          requiredLetter: Model.requiredLetter,
          userPoints: Model.userPoints,
        };
        
        // Convert JSON object to string and save to file
        const jsonData = JSON.stringify(userData);
        const fileName = 'SpellingBee.json';
        const fileData = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', fileData);
        linkElement.setAttribute('download', fileName);
        linkElement.click();

        Commands.newPuzzle(Model, database, View);
      } 
      // Clicked no for do not save
      else if (button && !button.value) {
        Commands.newPuzzle(Model, database, View);
      }
    });

    //Changed button names from the default Modal created above
    document.getElementsByClassName("btn btn-primary")[0].innerHTML = "YES";
    document.getElementsByClassName("btn btn-default")[0].innerHTML = "NO";
  }

  saveFile() {
    let userData = {
      RequiredLetter: Model.requiredLetter.toLowerCase(),
      PuzzleLetters: Model.currentPuzzle.toString().toLowerCase().replace(/,/g, ""),
      CurrentPoints: Model.userPoints,
      MaxPoints: Model.maxPoints,
      GuessedWords: Model.foundWords.map(element => element.toLowerCase()),
      WordList: Model.possibleGuesses.map(element => element.toLowerCase())
    };
    
    // Convert JSON object to string and save to file
    const jsonData = JSON.stringify(userData);
    const fileName = 'SpellingBee.json';
    const fileData = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', fileData);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
  }
}

module.exports = GUI_Controller;
