//TODO!
//Function to find a specifc html tasks by adding an ID for each tasks

//Return the ID of element as a java script object, store all in the array and suffle and change what they say inside them This.TopLeftBlock

class GUI_View {
    constructor() {
        this.MiddleLeftBlock = document.getElementById("MiddleLeftBlock");

        this.TopLeftBlock = document.getElementById("TopLeftBlock")

        this.Middle = document.getElementById("Middle");

        this.TopRightBlock = document.getElementById("TopRightBlock");

        this.BottomRightBlock = document.getElementById("BottomRightBlock");

        this.BottomLeftBlock = document.getElementById("BottomLeftBlock");

        this.MiddleRightBlock = document.getElementById("MiddleRightBlock");
    }

    stuff(word) {
        this.MiddleLeftBlock.innerHTML = word.charAt(0);
        this.TopLeftBlock.innerHTML = word.charAt(1);
        this.Middle.innerHTML = word.charAt(2);
        this.TopRightBlock.innerHTML = word.charAt(3);
        this.BottomRightBlock.innerHTML = word.charAt(4);
        this.BottomLeftBlock.innerHTML = word.charAt(5);
        this.MiddleRightBlock.innerHTML = word.charAt(6);
    }
}

module.exports = GUI_View;
