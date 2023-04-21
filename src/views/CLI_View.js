const { createCanvas, loadImage } = require('canvas')
const fs = require('fs');

/**
 * Stores CLI View class
 */

/**
 * View for the CLI following the MVC Model
 */
class CLI_View {
  constructor() { }

  /**
   * Shows current found word in puzzle
   * @param {Model} Model - object used to keep track of the game/player
   * @returns
   */
  showFoundWords(Model) {
    // If no current puzzle
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return false;
    }

    // If no words found yet
    if (Model.foundWords.length <= 0) {
      console.log("No words found");
      return;
    }

    console.log(Model.foundWords);
  }

  /**
   * Shows the current puzzle and the required letter
   * @param {Model} Model
   * @returns
   */
  showPuzzle(Model) {
    // If no current puzzle
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    //prints out the current puzzle and the required letter in the console
    console.log(
      "Use the letters below to make a guess, required letter is \x1b[93mYellow.\x1b[0m"
    );

    //check where required letter is in array
    if (Model.currentPuzzle[3] !== Model.requiredLetter) {
      for (let index = 0; index < 7; index++) {
        if (Model.currentPuzzle[index] === Model.requiredLetter) {
          //swaps where required letter is to the center of the array
          [Model.currentPuzzle[index], Model.currentPuzzle[3]] = [
            Model.currentPuzzle[3],
            Model.currentPuzzle[index],
          ];
        }
      }
    }

    //changes output letters to ALL-CAPS.
    for (let index = 0; index < Model.currentPuzzle.length; index++) {
      Model.currentPuzzle[index] = Model.currentPuzzle[index].toUpperCase();
    }
    let reqLetter = Model.currentPuzzle[3];

    //formatted output in a hex shape.
    console.log(
      "   %s     %s\n\n%s   \x1b[93m{ %s }\x1b[0m   %s\n\n   %s     %s",
      Model.currentPuzzle[0],
      Model.currentPuzzle[1],
      Model.currentPuzzle[2],
      reqLetter,
      Model.currentPuzzle[4],
      Model.currentPuzzle[5],
      Model.currentPuzzle[6]
    );
  }

  /**
   * Displays the users current rank in the puzzle
   * @param {Model} Model - Model object used to check if puzzle is open and to show the puzzle rank
   * @returns
   */
  showPuzzleRank(Model) {
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle in progress");
      return;
    }

    const MAX_POINTS = Model.maxPoints;

    // Ranking system: https://freebee.fun/api.html

    let scorePercentage = Model.userPoints / MAX_POINTS;

    let rank = Model.getRankName(scorePercentage);

    console.log("Your rank: " + rank);
    console.log(Model.userPoints + `/${MAX_POINTS} points`);
  }

  showPangramMessage(message) {
    console.log(
      "\x1b[93mY\x1b[31mO\x1b[32mU \x1b[34mF\x1b[35mO\x1b[33mU\x1b[37mN\x1b[93mD \x1b[31mA \x1b[32mP\x1b[33mA\x1b[34mN\x1b[35mG\x1b[37mR\x1b[31mA\x1b[32mM\x1b[34m!\x1b[0m"
    );
    console.log("\x1b[93m" + message.toUpperCase() + "\x1b[0m");
  }

  /**
   * 
   * @param {*} hintGrid 
   */
  showHintGrid(Model) {

    // Format spelling bee grid
    let formattedGrid = Model.currentPuzzleHints
      .map(row => row.map(cell => String(cell).replace(/[\[\],]/g, '').padStart(3)).join(' '))
      .join('\n');

    let isBingo = "";
    if (Model.bingoCount == 1) {
      isBingo = ", BINGO";
    }
    console.log("Perfect Pangrams: " + Model.totalPangrams + isBingo);
    console.log(formattedGrid + "\n");
  }

  /**
   * 
   * @param {*} twoLetterHint 
   */
  showTwoLetterHint(twoLetterHint) {
    // Format two-letter hints
    let hintString = twoLetterHint
      .map(hint => hint.replace(': ', '-'))
      .join('  ')
      .toUpperCase();


    console.log(hintString);
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

  shareImg(Model) {
    if (!Model.isPuzzleOpen) {
      console.log("No puzzle open");
      return;
    }

    // Create a new canvas element
    const canvas = createCanvas(500, 500)
    const ctx = canvas.getContext('2d')

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

    let rankString = "Rank: " + Model.getRankName(Model.userPoints / Model.maxPoints);
    let pointsString = "Points: " + Model.userPoints + "/" + Model.maxPoints;

    ctx.fillStyle = "black"; // set the fill color
    ctx.fill();
    const fontSize = 36;
    const fontFamily = "Times New Roman";
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
    x = center.x - (hexagonSideLength * 2) - (hexagonSideLength / 2)  + offsetX;
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

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('output.png', buffer);

    console.log("Created image");
  }

  showSuccessMessage(string) {
    console.log(string);
  }

  showErrorMessage(string) {
    console.error(string);
  }

  showHintMessage(Model) {
    console.log(Model.currentPuzzleHints);
  }

}

module.exports = CLI_View;
