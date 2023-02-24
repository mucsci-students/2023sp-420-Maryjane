//Function to find a specifc html tasks by adding an ID for each tasks

//Return the ID of element as a java script object, store all in the array and suffle and change what they say inside them This.TopLeftBlock
class GUI_View {
  constructor(model) {
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

    //add event listner to window to capture enter key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.getEnterBtn();
      }
    });

    //add event listner to window to set focus back on input box
    window.addEventListener("click", () => {
      this.userInput.focus();
    });
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

  getButtonClick(i) {
    this.userInput.value += i;
  }
  getDeleteBtn() {
    const currentValue = this.userInput.value;
    const modifiedValue = currentValue.slice(0, -1);
    this.userInput.value = modifiedValue;
  }

  getEnterBtn() {
    let input = this.userInput.value;

    //TODO: check dictionary for vaild word and update rank accordingly ***********VERY IMPORTANT***********

    if (!input || input.length < 4) //side note: is this the correct input length?
    {
      this.errorMessage.innerHTML = "Input too short";
      this.userInput.value = "";

      setTimeout(() => {
        this.errorMessage.innerHTML = "&zwnj;";
      }, 1000); // Show the error message for 1 second
    }
    else if (!this.userInput.value.includes(this.Model.requiredLetter)) {
      this.errorMessage.innerHTML = "Missing center letter";
      this.userInput.value = "";

      setTimeout(() => {
        this.errorMessage.innerHTML = "&zwnj;";
      }, 1000); // Show the error message for 1 second
    }
    else {
      this.textArea.innerHTML += input + "  ";
      this.userInput.value = "";
    }
  }
}

module.exports = GUI_View;
