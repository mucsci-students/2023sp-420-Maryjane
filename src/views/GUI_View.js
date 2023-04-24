//Function to find a specific html tasks by adding an ID for each tasks
const Commands = require("../commands/commands.js");
const Modal = require('modal-vanilla');
const crypto = require('crypto');

const keyArray = new Uint8Array([0x5f, 0x73, 0x3b, 0x44, 0x1f, 0xa2, 0xa0, 0x1b, 0x17, 0xd5, 0xf9, 0x8e, 0x9f, 0x7c, 0xfe, 0xeb, 0x2b, 0x1e, 0x22, 0xc5, 0x48, 0xba, 0xa8, 0x3d, 0x06, 0x2e, 0x3a, 0xb1, 0xb8, 0xc0, 0x6a, 0x32]);
const iv = new Uint8Array([0xb8, 0xc3, 0x0f, 0x7a, 0x1d, 0x72, 0xe1, 0xae, 0xbc, 0x10, 0x0e, 0x8a, 0x0d, 0x7b, 0xa5, 0x04]);


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

            Commands.newPuzzleFromBase(
              inputFieldNewPuzzleFromBaseValue,
              Model,
              View
            );
            userInput.focus();
          }
          // Clicked no for do not save
          else if (button && !button.value) {
            Commands.newPuzzleFromBase(
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
      reader.addEventListener('load', async (event) => {

        const jsonData = JSON.parse(event.target.result);

        // Populate form fields with loaded data
        this.Model.foundWords = jsonData.GuessedWords.map(element => element.toUpperCase());
        this.Model.pangram = jsonData.PuzzleLetters.toUpperCase();
        this.Model.requiredLetter = jsonData.RequiredLetter.toUpperCase();
        this.Model.userPoints = jsonData.CurrentPoints;
        this.Model.maxPoints = jsonData.MaxPoints;

        // No encryption case
        if (typeof jsonData.WordList === "object") {
          this.Model.possibleGuesses = jsonData.WordList.map(element => element.toUpperCase());
        } else {
          this.Model.possibleGuesses = JSON.parse(await decrypt(jsonData.EncryptedWordList));
        }

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

    //saveCheckBox
    const saveCheckBox = document.querySelector('#saveCheckBox');
    // saveCheckBox.addEventListener('click', function () {
    //   if (saveCheckBox.checked) {
    //     // checkbox is selected
    //     console.log('Encryption is selected');
    //   } else {
    //     // checkbox is not selected 
    //     console.log('Encryption is not selected');
    //   }
    // });


    this.saveSubmitBtn.addEventListener("click", async () => {
      let secretData;

      await encrypt(this.Model.possibleGuesses)
        .then(encryptedData => {
          secretData = encryptedData;
        })
        .catch(error => {
          console.error('Encryption error:', error);
        });

      let userData = {
        RequiredLetter: this.Model.requiredLetter.toLowerCase(),
        PuzzleLetters: this.Model.currentPuzzle.toString().toLowerCase().replace(/,/g, ""),
        CurrentPoints: this.Model.userPoints,
        MaxPoints: this.Model.maxPoints,
        GuessedWords: this.Model.foundWords.map(element => element.toLowerCase()),
      };

      if (saveCheckBox.checked) {
        userData.EncryptedWordList = secretData;
        userData.Author = "MaryJane";
      } else {
        userData.WordList = this.Model.possibleGuesses.map(element => element.toLowerCase());
      }


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

    //----------------------------------ENCRYPTION---------------------------------------------------->  

    // encrypt the JSON string using the fixed key and IV
    // your plaintext string
    // plaintext = this.Model.possibleGuesses.stringify();

    // encrypt the plaintext using the key and IV
    async function encrypt(plaintext) {
      const algorithm = { name: 'AES-CBC', length: 256 };
      const key = await window.crypto.subtle.importKey('raw', keyArray, algorithm, false, ['encrypt', 'decrypt']);

      const messageBuffer = new TextEncoder().encode(JSON.stringify(plaintext));
      const encryptedBuffer = await window.crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, messageBuffer);
      const encryptedData = Array.from(new Uint8Array(encryptedBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

      return encryptedData;
    }

    async function decrypt(encryptedData) {
      const algorithm = { name: 'AES-CBC', length: 256 };
      const key = await window.crypto.subtle.importKey('raw', keyArray, algorithm, false, ['encrypt', 'decrypt']);

      const encryptedBuffer = new Uint8Array(encryptedData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
      const decryptedBuffer = await window.crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encryptedBuffer);
      const decryptedData = new TextDecoder().decode(decryptedBuffer);

      return decryptedData;
    }

    // call the functions and log the result
    // importKey(keyArray)
    //   .then(key => encrypt(plaintext, key, iv))
    //   .then(ciphertext => console.log(ciphertext))
    //   .catch(error => console.error(error));


    //----------------------------------ENCRYPTION---------------------------------------------------->

    //hint modal
    const hintModal = document.querySelector("#hintModal");
    const close = document.querySelector(".close");

    close.addEventListener("click", () => {
      hintModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === hintModal) {
        hintModal.style.display = "none";
      }
    });

    //highscore modal
    const highScoreModal = document.querySelector("#highScoreModal");
    const close2 = document.querySelector(".close2");

    close2.addEventListener("click", () => {
      highScoreModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === highScoreModal) {
        highScoreModal.style.display = "none";
      }
    });

    //share modal
    const shareModal = document.querySelector("#shareModal");
    const close3 = document.querySelector(".close3");

    close3.addEventListener("click", () => {
      shareModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
      if (event.target === shareModal) {
        shareModal.style.display = "none";
      }
    });


  }

  showPuzzle() {
    let word = this.Model.currentPuzzle;
    let pos = this.Model.currentPuzzle.indexOf(this.Model.requiredLetter);

    let temp = word[3];
    word[3] = this.Model.requiredLetter;
    word[pos] = temp;

    this.TopLeftBlock.innerHTML = word[0];
    this.TopRightBlock.innerHTML = word[1];
    this.MiddleLeftBlock.innerHTML = word[2];
    this.Middle.innerHTML = word[3];
    this.MiddleRightBlock.innerHTML = word[4];
    this.BottomLeftBlock.innerHTML = word[5];
    this.BottomRightBlock.innerHTML = word[6];

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

  drawHexagon(canvas, x, y, sideLength, color, letter = 'a', textColor = 'black') {
    const ctx = canvas.getContext('2d');

    let rotationAngle = 90 * Math.PI / 180;

    // calculate the coordinates of the hexagon vertices
    const angle = Math.PI / 3; // the angle between each vertex
    const x1 = x + Math.cos(0 + rotationAngle) * sideLength;
    const y1 = y + Math.sin(0 + rotationAngle) * sideLength;
    const x2 = x + Math.cos(angle + rotationAngle) * sideLength;
    const y2 = y + Math.sin(angle + rotationAngle) * sideLength;
    const x3 = x + Math.cos(2 * angle + rotationAngle) * sideLength;
    const y3 = y + Math.sin(2 * angle + rotationAngle) * sideLength;
    const x4 = x + Math.cos(3 * angle + rotationAngle) * sideLength;
    const y4 = y + Math.sin(3 * angle + rotationAngle) * sideLength;
    const x5 = x + Math.cos(4 * angle + rotationAngle) * sideLength;
    const y5 = y + Math.sin(4 * angle + rotationAngle) * sideLength;
    const x6 = x + Math.cos(5 * angle + rotationAngle) * sideLength;
    const y6 = y + Math.sin(5 * angle + rotationAngle) * sideLength;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.lineTo(x5, y5);
    ctx.lineTo(x6, y6);
    ctx.closePath();

    ctx.fillStyle = color; // set the fill color
    ctx.fill(); // fill the hexagon
    //ctx.stroke(); // draw the hexagon border

    // draw the letter
    ctx.fillStyle = textColor; // set the fill color for the letter
    ctx.font = 'bold 30px sans-serif'; // set the font for the letter
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, x, y);
  }

  //!! TODO ADD SHARE IMMPLEMENTATION HERE!!!!!!!------------------------------------------------------>
  getShareBtn(Model) {
    // Create a new canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 500;

    // get the canvas element and draw the big hexagon from small hexagons
    //const canvas = document.getElementById('canvas');
    const hexagonSideLength = 50;
    const hexagonRadius = hexagonSideLength / Math.cos(Math.PI / 6); // calculate the radius of the big hexagon so that the small hexagons don't overlap
    const center = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };

    ctx.fillStyle = "white"; // set the fill color
    ctx.fill();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let rankString = "Rank: " + this.Model.getRankName(this.Model.userPoints / this.Model.maxPoints);
    let pointsString = "Points: " + this.Model.userPoints + "/" + this.Model.maxPoints;

    ctx.fillStyle = "black"; // set the fill color
    ctx.fill();
    const fontSize = 36;
    const fontFamily = "sans-serif";
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillText(rankString, center.x - (ctx.measureText(rankString).width / 2), 36);
    ctx.fillText(pointsString, center.x - (ctx.measureText(pointsString).width / 2), (36 * 2) + 20);

    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    let x, y;
    let colorIndex = 0;

    let offsetX = 25;
    let offsetY = 75;

    // first row with 2 hexagons
    const row1 = 2;
    x = center.x - hexagonSideLength - (hexagonSideLength / 2) + offsetX;
    y = center.y - (hexagonRadius * 2) + offsetY;
    for (let i = 0; i < row1; i++) {
      this.drawHexagon(canvas, x, y, hexagonSideLength - 1, '#E6E6E6', Model.currentPuzzle[i]);
      x += hexagonSideLength + hexagonSideLength;
      colorIndex = (colorIndex + 1) % colors.length;
    }

    // second row with three hexagons
    const row2 = 3;
    x = center.x - (hexagonSideLength * 2) - (hexagonSideLength / 2) + offsetX;
    y = center.y - hexagonRadius / 2 + offsetY;
    for (let i = 0; i < row2; i++) {
      this.drawHexagon(canvas, x, y, hexagonSideLength - 1, i % 2 == 0 ? '#E6E6E6' : 'rgb(238, 206, 44)', Model.currentPuzzle[i + row1]);
      x += hexagonSideLength + hexagonSideLength;
      colorIndex = (colorIndex + 1) % colors.length;
    }

    // third row with 2 hexagons
    const row3 = 2;
    x = center.x - hexagonSideLength - (hexagonSideLength / 2) + offsetX;
    y = center.y + hexagonRadius + offsetY;
    for (let i = 0; i < row3; i++) {
      this.drawHexagon(canvas, x, y, hexagonSideLength - 1, '#E6E6E6', Model.currentPuzzle[i + row1 + row2]);
      x += hexagonSideLength + hexagonSideLength;
    }

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'hexagon.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //!! TODO ADD HIGHSCORE IMMPLEMENTATION HERE!!!!!!!------------------------------------------------------>
  async getHighScoreBtn() {
    highScoreModal.style.display = "block";

    let highScoreText = document.getElementById("highScoreText");

    await Commands.highScoreCommand(this.Model);

    //read the json file from local files
    let formattedHighScores = this.Model.highScores.replace("\n", "<br>");

    highScoreText.innerHTML = this.Model.highScores == "" ? "No highscores for current puzzles" : formattedHighScores;
  }

  getHintBtn() {
    hintModal.style.display = "block";

    //grab currPuzzle id and set its innerHTmle to the current puzzle.
    let currPuzzle = document.getElementById("currPuzzle");

    //get the current puzzle, then get the required letter, then color the required letter in the current puzzle red. space out the letters evenly
    currPuzzle.innerHTML = "Current Puzzle:&nbsp; " + this.Model.currentPuzzle.join(" ").replace(this.Model.requiredLetter, "<span style='color:red'>" + this.Model.requiredLetter + "</span>");

    //grab the puzzleInfo id and set its innerHTML to the amount of words, points, pangrams, and bingo
    let puzzleInfo = document.getElementById("puzzleInfo");

    //get the amount of words, points, pangrams, and bingo
    //TODO: get the amount of pangrams and bingo

    //Call Commands to generate the hint
    Commands.generateHint(this.Model, this);

    let words = this.Model.possibleGuesses.length;
    let totalPangrams = this.Model.totalPangrams;
    //let bingoCount = this.Model.bingoCount;

    let isBingo = "";
    if (this.Model.bingoCount == 1) {
      isBingo = " BINGO";
    }

    puzzleInfo.innerHTML = "Words: " + words + "&nbsp; Points: " + this.Model.maxPoints + "&nbsp; Perfect Pangrams: " + totalPangrams + isBingo;

    // Format spelling bee grid
    let formattedGrid = this.Model.currentPuzzleHints
      .map(row => '<tr>' + row.map(cell => `<td>${String(cell).replace(/[\[\],]/g, '')}</td>`).join('') + '</tr>')
      .join('');

    // Format two-letter hints
    let hintString = this.Model.currentPuzzleTwoLetterHint
      .map(hint => hint.replace(':', ': '))
      .join('  ')
      .toUpperCase();

    //grab the hintGrid p tag by id and set the innerHTML to the formatted grid.
    let hintGrid = document.getElementById("hintGrid");
    hintGrid.innerHTML = '<table id="hintTable">' + formattedGrid + '</table>';

    //grab the hintGrid p tag by id and set the innerHTML to the formatted grid.
    let hintWords = document.getElementById("hintTwoLetterList");

    //clear the hintWords element before setting the innerHTML
    hintWords.innerHTML = "";
    hintWords.innerHTML = '<textarea wrap="hard"readonly style="font-family: \'Nunito Sans\', sans-serif; font-weight: 700; text-transform: uppercase; resize: none; width: 100%; height: 120px; margin-top: 10px;">' + hintString + '</textarea>';
  }


  showHintGrid(string) {
    //console.log(string);
  }

  showTwoLetterHint(string) {
    //console.log(string);
  }

}

module.exports = GUI_View;
