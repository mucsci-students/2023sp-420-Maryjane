//Function to find a specific html tasks by adding an ID for each tasks
const Commands = require("../classes/Commands.js");
//Return the ID of element as a JavaScript object, store all in the array and shuffle and change what they say inside them This.TopLeftBlock
class GUI_View {

  /**
   * Sets up the view by passing in the Model
   * @param {Model} model
   */
  constructor(model) {

    this.message_Display_Time_In_Milliseconds_For_Success_And_Failure_When_User_Enters_Guess = 1700;

    this.MiddleLeftBlock = document.getElementById("MiddleLeftBlock");
    this.TopLeftBlock = document.getElementById("TopLeftBlock");
    this.Middle = document.getElementById("Middle");
    this.TopRightBlock = document.getElementById("TopRightBlock");
    this.BottomRightBlock = document.getElementById("BottomRightBlock");
    this.BottomLeftBlock = document.getElementById("BottomLeftBlock");
    this.MiddleRightBlock = document.getElementById("MiddleRightBlock");

    this.userInput = document.getElementById("userInput");
    this.delete = document.getElementById("Deletebtn");
    this.textArea = document.getElementById("textArea");
    this.errorMessage = document.getElementById("errorMessage");
    this.Model = model;


    this.NORMAL_VIEW = 0;
    this.NEW_PUZZLE_FROM_BASE_VIEW = 1;
    this.HELP_VIEW = 2;
    this.currentView = this.NORMAL_VIEW;

    //add clicks


    //FIX LATER 
    /*
    const newPuzzleFromBaseBtn = document.querySelector("#newPuzzleFromBaseBtn");
    const modalContainer = document.querySelector("#modalContainer");
    const closeModalBtn = document.querySelector("#closeModal");
    const submitNewWordBtn = document.querySelector("#submitNewWordBtn");
    const newWordInput = document.querySelector("#newWordInput");

    newPuzzleFromBaseBtn.addEventListener("click", () => {
      this.isModal = true;
      modalContainer.style.display = "block";
      this.userInput.blur();
    });

    closeModalBtn.addEventListener("click", () => {
      modalContainer.style.display = "none";
      this.isModal = false;
    });

    submitNewWordBtn.addEventListener("click", () => {
      const newWord = newWordInput.value.trim();
      if (newWord) {
        // Do something with the new word here
        console.log("New word: ", newWord);
        modalContainer.style.display = "none";
      }
    });
    */
  }

  showPuzzle() {
    let word = this.Model.currentPuzzle;
    let pos = this.Model.currentPuzzle.indexOf(this.Model.requiredLetter);

    console.log(this.Model.currentPuzzle);

    let temp = word[2];
    word[2] = this.Model.requiredLetter;
    word[pos] = temp;

    this.MiddleLeftBlock.innerHTML = word[0];
    this.TopLeftBlock.innerHTML = word[1];
    this.Middle.innerHTML = word[2];
    this.TopRightBlock.innerHTML = word[3];
    this.BottomRightBlock.innerHTML = word[4];
    this.BottomLeftBlock.innerHTML = word[5];
    this.MiddleRightBlock.innerHTML = word[6];
  }

  addLetterToInputField(i) {
    this.userInput.value += i;
  }

  getDeleteBtn() {
    const currentValue = this.userInput.value;
    this.userInput.value = currentValue.slice(0, -1);
  }

  getEnterBtn() {
    //different casses for different views
    //new puzzle from base view
    //help view
    //normal view

    if (this.currentView === this.NORMAL_VIEW) {
      let input = this.userInput.value;
      let success = Commands.guess(input, this.Model, this);
      if (success) {
        this.textArea.innerHTML += input + "  ";
        this.userInput.value = "";
      }
      else {
        this.userInput.value = "";
      }
    }


  }

  updateRank() {
    let rankDisplay = document.getElementById("rankDisplay");
    rankDisplay.innerHTML = "Rank: " + this.Model.getRankName();
  }


  focusOnInputField() {
    if (!this.isModal) {
      this.userInput.focus();
    }
  }

  showErrorMessage(message) {
    this.errorMessage.style.color = "red";
    this.errorMessage.innerHTML = message;
    setTimeout(() => {
      this.errorMessage.innerHTML = "&zwnj;";
    }, this.message_Display_Time_In_Milliseconds_For_Success_And_Failure_When_User_Enters_Guess);
  }

  showSuccessMessage(message) {
    this.errorMessage.style.color = "green";
    this.errorMessage.innerHTML = message;
    setTimeout(() => {
      this.errorMessage.innerHTML = "&zwnj;";
    }, this.message_Display_Time_In_Milliseconds_For_Success_And_Failure_When_User_Enters_Guess);
  }

  showPangramMessage(message) {
    let color = ["red", "orange", "#f2e555", "green", "blue", "indigo", "violet"];
    let newMessage = "YOU FOUND A PANGRAM: " + message;
    let newMessage2 = "";
    for (let i = 0; i < newMessage.length; i++) {
      newMessage2 += "<span style='color:" + color[i % color.length] + "'>" + newMessage[i] + "</span>";
    }
    this.errorMessage.innerHTML = newMessage2;
    this.addConfetti();
  }

  addConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

module.exports = GUI_View;
