
//GameManager object
var GameManager = require('../src/classes/GameManager.js');

//GameManager object
var Commands = require('../src/classes/Commands.js');

// Used to test the guess command
function testGuessCommand() {
    //https://spellingbeetimes.com/2023/01/31/new-york-times-nyt-spelling-bee-answers-and-solution-for-january-31-2023/

    let gameManager = new GameManager();

    // Test that the puzzle must be open
    Commands.guess("123", gameManager);

    gameManager.isPuzzleOpen = true;
    gameManager.pangram = "pinewood";
    gameManager.requiredLetter = "I";

    // Test that the guess must be more than 3 chars.
    Commands.guess("123", gameManager);
    // Check that the guess uses the required letter.
    Commands.guess("aaaa", gameManager);
    // Check that the guess has all letters from the pangram
    Commands.guess("pina", gameManager);
    // Success
    Commands.guess("pine", gameManager);
    // Success
    Commands.guess("pinewood", gameManager);


}   

// Used to call all the test methods
function runTests() {
    testGuessCommand();
}

// Run the testing method
runTests();
