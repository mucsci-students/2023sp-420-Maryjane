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

    this.Model = model;
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

  buttonClickMiddleRight(i) 
  {
    userInput.value += i;
  }
}

module.exports = GUI_View;
