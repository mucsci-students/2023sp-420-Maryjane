//Function to find a specific html tasks by adding an ID for each tasks
const Commands = require("../classes/Commands.js");
const Modal = require('modal-vanilla');

//Return the ID of element as a JavaScript object, store all in the array and shuffle and change what they say inside them This.TopLeftBlock
class GUI_View {
  /**
   * Sets up the view by passing in the Model
   * @param {Model} model
   */
  constructor(model) {
    //the model
    this.Model = model;

    //Message display time (Funny variable made by team)
    this.message_Display_Time_In_Milliseconds_For_Success_And_Failure_When_User_Enters_Guess = 1700;

    //---------------------------------- HEXAGON BUTTONS ---------------------------------------------->

    this.MiddleLeftBlock = document.getElementById("MiddleLeftBlock");
    this.TopLeftBlock = document.getElementById("TopLeftBlock");
    this.Middle = document.getElementById("Middle");
    this.TopRightBlock = document.getElementById("TopRightBlock");
    this.BottomRightBlock = document.getElementById("BottomRightBlock");
    this.BottomLeftBlock = document.getElementById("BottomLeftBlock");
    this.MiddleRightBlock = document.getElementById("MiddleRightBlock");

    //---------------------------------- HEXAGON BUTTONS ---------------------------------------------->

    //---------------------------------- USER INPUT --------------------------------------------------->

    this.errorMessage = document.getElementById("errorMessage");
    this.userInput = document.getElementById("userInput");
    this.textArea = document.getElementById("textArea");

    this.inputFieldLoad = document.getElementById("inputFieldLoad");
    this.inputFieldSave = document.getElementById("inputFieldSave");
    this.inputFieldNewPuzzleFromBase = document.getElementById(
      "inputFieldNewPuzzleFromBase"
    );

    //---------------------------------- USER INPUT --------------------------------------------------->

    //---------------------------------- OTHER -------------------------------------------------------->

    //Note: add click event listeners to the buttons

    //NOTE: PLEASE READ!!! -- focus is a lil buggy, so if the focus is lost just click on the input field above
    // the guesssed word and it will regain focus

    //for adding the focus to the input field
    this.inputFieldNewPuzzleFromBase.addEventListener("click", () => {
      this.inputFieldNewPuzzleFromBase.focus();
    });

    this.inputFieldLoad.addEventListener("click", () => {
      this.inputFieldLoad.focus();
    });

    this.inputFieldSave.addEventListener("click", () => {
      this.inputFieldSave.focus();
    });

    //for removing the focus from the input field
    this.inputFieldNewPuzzleFromBase.addEventListener("blur", () => {
      this.userInput.focus();
    });

    this.inputFieldLoad.addEventListener("blur", () => {
      this.userInput.focus();
    });

    this.inputFieldSave.addEventListener("blur", () => {
      this.userInput.focus();
    });

    this.userInput.focus();

    this.newPuzzleFromBaseSubmitBtn = document.getElementById(
      "newPuzzleFromBaseSubmitBtn"
    );


    this.saveSubmitBtn = document.getElementById("saveSubmitBtn");
    //this.loadSubmitBtn = document.getElementById("loadSubmitBtn");

    //if i click on the new puzzle button I want to be able to type new word in
    this.newPuzzleFromBaseSubmitBtn.addEventListener("click", () => {

      let inputFieldNewPuzzleFromBaseValue = this.inputFieldNewPuzzleFromBase.value;
      let Model = this.Model;
      let View = this;

      // Create and show save prompt
      new Modal({
        title: 'Save Prompt',
        content: 'Do you wish to save before starting a new puzzle?',
        transition: 0,
        backdropTransition: 0
      })
        .show()
        .once('dismiss', function (modal, ev, button) {

          // Clicked yes for save
          if (button && button.value) {

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

            Commands.identifyBaseWord(
              inputFieldNewPuzzleFromBaseValue,
              Model,
              View
            );
            userInput.focus();
          }
          // Clicked no for do not save
          else if (button && !button.value) {
            Commands.identifyBaseWord(
              inputFieldNewPuzzleFromBaseValue,
              Model,
              View
            );
            userInput.focus();
          }
        });

      //Changed button names from the default Modal created above
      document.getElementsByClassName("btn btn-primary")[0].innerHTML = "YES";
      document.getElementsByClassName("btn btn-default")[0].innerHTML = "NO";

      this.textArea.innerHTML = "";
      this.userInput.focus();
    });

    //if I type any character that is not a letter it will not accept in the input in the input tag
    this.userInput.addEventListener("keydown", (event) => {
      const allowedKeys = /[a-zA-Z]/; // Regular expression to match only letters into the html
      const key = event.key.toUpperCase();

      // Check if the pressed key is an allowed letter
      if (!allowedKeys.test(key) || (!model.currentPuzzle.includes(key) && key !== 'BACKSPACE' && key !== 'DELETE' && key !== 'enter')) {
        // Prevent the default action of the key (i.e., typing the character)
        event.preventDefault();
      }
    });

    //---------------------------------- OTHER --------------------------------------------------->

    //---------------------------------- NAV BAR ------------------------------------------------->

    const navbarMenu = document.getElementById("navbar");
    const burgerMenu = document.getElementById("burger");
    const overlayMenu = document.querySelector(".overlay");

    // Show and Hide Navbar Function
    const toggleMenu = () => {
      navbarMenu.classList.toggle("active");
      overlayMenu.classList.toggle("active");
    };

    // Collapsible Mobile Submenu Function
    const collapseSubMenu = () => {
      navbarMenu
        .querySelector(".menu-dropdown.active .submenu")
        .removeAttribute("style");
      navbarMenu
        .querySelector(".menu-dropdown.active")
        .classList.remove("active");
    };

    // Toggle Mobile Submenu Function
    const toggleSubMenu = (e) => {
      if (e.target.hasAttribute("data-toggle") && window.innerWidth <= 992) {
        e.preventDefault();
        const menuDropdown = e.target.parentElement;

        // If Dropdown is Expanded, then Collapse It
        if (menuDropdown.classList.contains("active")) {
          collapseSubMenu();
        } else {
          // Collapse Existing Expanded Dropdown
          if (navbarMenu.querySelector(".menu-dropdown.active")) {
            collapseSubMenu();
          }

          // Expanded the New Dropdown
          menuDropdown.classList.add("active");
          const subMenu = menuDropdown.querySelector(".submenu");
          subMenu.style.maxHeight = subMenu.scrollHeight + "px";
        }
      }
    };

    // Fixed Resize Window Function
    const resizeWindow = () => {
      if (window.innerWidth > 992) {
        if (navbarMenu.classList.contains("active")) {
          toggleMenu();
        }
        if (navbarMenu.querySelector(".menu-dropdown.active")) {
          collapseSubMenu();
        }
      }
    };

    // Initialize Event Listeners
    burgerMenu.addEventListener("click", toggleMenu);
    overlayMenu.addEventListener("click", toggleMenu);
    navbarMenu.addEventListener("click", toggleSubMenu);
    window.addEventListener("resize", resizeWindow);

    //---------------------------------- NAV BAR ------------------------------------------------->








    //---------------------------------- LOAD -------------------------------------------------------->
    this.inputFieldLoad.addEventListener('change', () => {
      const file = this.inputFieldLoad.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {

        const jsonData = JSON.parse(event.target.result);

        // Populate form fields with loaded data
        this.Model.foundWords = jsonData.GuessedWords.map(element => element.toUpperCase());
        this.Model.pangram = jsonData.PuzzleLetters.toUpperCase();
        this.Model.requiredLetter = jsonData.RequiredLetter.toUpperCase();
        this.Model.userPoints = jsonData.CurrentPoints;
        this.Model.possibleGuesses = jsonData.WordList.map(element => element.toUpperCase());
        this.Model.maxPoints = jsonData.MaxPoints;

        this.Model.isPuzzleOpen = true;

        let pangramLetters = String.prototype.concat
          .call(...new Set(this.Model.pangram))
          .split("");

        this.Model.currentPuzzle = pangramLetters
          .sort((a, b) => 0.5 - Math.random())
          .sort((a, b) => 0.5 - Math.random());
        this.showPuzzle();
      });
      reader.readAsText(file);
    });
    //---------------------------------- LOAD -------------------------------------------------------->

    //---------------------------------- SAVE -------------------------------------------------------->

    this.saveSubmitBtn.addEventListener("click", () => {
      let userData = {
       RequiredLetter: this.Model.requiredLetter.toLowerCase(),
        PuzzleLetters: this.Model.currentPuzzle.toString().toLowerCase().replace(/,/g, ""),
        CurrentPoints: this.Model.userPoints,
        MaxPoints: this.Model.maxPoints,
        GuessedWords: this.Model.foundWords.map(element => element.toLowerCase()),
        WordList: this.Model.possibleGuesses.map(element => element.toLowerCase())
      };

      // Convert JSON object to string and save to file
      const jsonData = JSON.stringify(userData);
      const fileName = this.inputFieldSave.value += '.json';
      const fileData = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', fileData);
      linkElement.setAttribute('download', fileName);
      linkElement.click();
      this.inputFieldSave.value = "";
    });





    //---------------------------------- SAVE -------------------------------------------------------->

  }

  showPuzzle() {
    let word = this.Model.currentPuzzle;
    let pos = this.Model.currentPuzzle.indexOf(this.Model.requiredLetter);

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

    this.updateRank();
    this.textArea.innerHTML = this.Model.foundWords.join("  ").toUpperCase();

  }
  //New Command for ShowPuzzleFrom Base
  ShowPuzzleFromBase() { }

  addLetterToInputField(i) {
    this.userInput.value += i.toUpperCase();
  }

  getDeleteBtn() {
    const currentValue = this.userInput.value;
    this.userInput.value = currentValue.slice(0, -1);
  }

  getEnterBtn() {
    //NOTE:
    //different casses for different views
    //new puzzle from base view
    //help view
    //normal view

    let input = this.userInput.value;
    let success = Commands.guess(input, this.Model, this);

    if (success) {
      this.showPuzzle();
      this.userInput.value = "";
    } else {
      this.userInput.value = "";
    }
  }

  updateRank() {
    let rank = document.getElementById("displayRank");
    rank.innerHTML = this.Model.getRankName(this.Model.userPoints / this.Model.maxPoints);
    let points = document.getElementById("displayPoints");
    points.innerHTML = "Points: " + this.Model.userPoints + "/" + this.Model.maxPoints;
  }

  focusOnInputField() { }

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
    let color = [
      "red",
      "orange",
      "#f2e555",
      "green",
      "blue",
      "indigo",
      "violet",
    ];
    let newMessage = "YOU FOUND A PANGRAM: " + message;
    let newMessage2 = "";
    for (let i = 0; i < newMessage.length; i++) {
      newMessage2 +=
        "<span style='color:" +
        color[i % color.length] +
        "'>" +
        newMessage[i] +
        "</span>";
    }
    this.errorMessage.innerHTML = newMessage2;
    this.addConfetti();
    setTimeout(() => {
      this.errorMessage.innerHTML = "&zwnj;";
    }, this.message_Display_Time_In_Milliseconds_For_Success_And_Failure_When_User_Enters_Guess + 800);
  }

  addConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  toggleDarkMode() {
    let body = document.querySelector('body');
    body.classList.toggle('dark-mode');

    this.userInput.classList.toggle('yellowText');
    this.textArea.classList.toggle('whiteText');
    this.userInput.focus();
  }

}

module.exports = GUI_View;
