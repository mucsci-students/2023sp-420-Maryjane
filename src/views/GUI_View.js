//Function to find a specific html tasks by adding an ID for each tasks
const Commands = require("../classes/Commands.js");

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
    this.loadSubmitBtn = document.getElementById("loadSubmitBtn");

    //if i click on the new puzzle button, then i want an alert to pop up
    this.newPuzzleFromBaseSubmitBtn.addEventListener("click", () => {
      this.userInput.focus();
      this.ShowPuzzleFromBase();
    });

    //if i click on the save button, then i want an alert to pop up
    this.saveSubmitBtn.addEventListener("click", () => {
      alert("Save Form Submitted");
      this.userInput.focus();
    });

    //if i click on the load button, then i want an alert to pop up
    this.loadSubmitBtn.addEventListener("click", () => {
      alert("Load Form Submitted");
      this.userInput.focus();
    });

    //if i type any character that is not a letter it will not accept in the input in the input tag
    this.userInput.addEventListener("keydown", (event) => {
      const allowedKeys = /[a-zA-Z]/; // Regular expression to match only letters into the html
      const key = event.key;

      // Check if the pressed key is an allowed letter
      if (!allowedKeys.test(key)) {
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
  //New Command
  ShowPuzzleFromBase() {
    Commands.identifyBaseWord(
      this.inputFieldNewPuzzleFromBase.value,
      this.Model,
      this.View
    );
  }

  addLetterToInputField(i) {
    this.userInput.value += i;
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
      this.textArea.innerHTML += input + "  ";
      this.userInput.value = "";
    } else {
      this.userInput.value = "";
    }
  }

  updateRank() {
    let rank = document.getElementById("displayRank");
    rank.innerHTML = this.Model.getRankName(this.Model.userPoints / 150);
    let points = document.getElementById("displayPoints");
    points.innerHTML = "Points: " + this.Model.userPoints + "/150";
  }

  focusOnInputField() {}

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
}

module.exports = GUI_View;
