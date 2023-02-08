const GameManagerClass = require("../src/classes/GameManager.js");
const Commands = require("../src/classes/Commands.js");

describe ("Test Guess Function", () => {
    
    // Setup gamemanager
    let GameManager = new GameManagerClass();
    GameManager.pangram = "pinewood";
    GameManager.currentPuzzle = ['p', 'i', 'n', 'e', 'w', 'o', 'd'];
    GameManager.requiredLetter = 'i';

    test("When a puzzle is not open, return false", () => {
        expect(Commands.guess("", GameManager)).toEqual(false)
    });

    GameManager.isPuzzleOpen = true;

    test("When the guess is an empty string, return false", () => {
        expect(Commands.guess("", GameManager)).toEqual(false)
    });

    test("When the guess is an empty string, return false", () => {
        expect(Commands.guess("", GameManager)).toEqual(false)
    });

    test("When the guess does not contain the required letter, return false", () => {
        expect(Commands.guess("wood", GameManager)).toEqual(false)
    });

    test("When the guess uses a letter that is not in the pangram, return false", () => {
        expect(Commands.guess("pines", GameManager)).toEqual(false)
    });

    test("When the user makes a valid guess, should return true and found words length should be 1", () => {
        expect(Commands.guess("pine", GameManager)).toEqual(true);
        expect(GameManager.foundWords.length).toEqual(1);
    });

    test("When the user makes a guess that has already been guess, return false and foundwords length does not change", () => {
        let prevLength = GameManager.foundWords.length;
        expect(Commands.guess("pine", GameManager)).toEqual(false);
        expect(GameManager.foundWords.length).toEqual(prevLength);
    });

    test("When the user makes a guess that is not from the dictionary, return false", () => {
        let prevLength = GameManager.foundWords.length;
        expect(Commands.guess("noen", GameManager)).toEqual(false);
        expect(GameManager.foundWords.length).toEqual(prevLength);
    });

});
