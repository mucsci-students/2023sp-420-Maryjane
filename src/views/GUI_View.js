//Function to find a specifc html tasks by adding an ID for each tasks

//Return the ID of element as a java script object, store all in the array and suffle and change what they say inside them This.TopLeftBlock
class GUI_View {
  constructor() {
    this.MiddleLeftBlock = document.getElementById("MiddleLeftBlock");
    this.TopLeftBlock = document.getElementById("TopLeftBlock");
    this.Middle = document.getElementById("Middle");
    this.TopRightBlock = document.getElementById("TopRightBlock");
    this.BottomRightBlock = document.getElementById("BottomRightBlock");
    this.BottomLeftBlock = document.getElementById("BottomLeftBlock");
    this.MiddleRightBlock = document.getElementById("MiddleRightBlock");
  }
  //Goes View -> Controller -> Model -> Controller -> View
  static newPuzzleStartUp() {
    MiddleLeftBlock.innerHTML = "p"; //GUI_Controller.getArrayCharacter

    TopLeftBlock.innerHTML = "O";

    Middle.innerHTML = "O";

    TopRightBlock.innerHTML = "O";

    BottomRightBlock.innerHTML = "O";

    BottomLeftBlock.innerHTML = "O";

    MiddleRightBlock.innerHTML = "O";
  }
}

module.exports = GUI_View;
