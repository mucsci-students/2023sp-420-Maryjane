const Commands = require("../src/commands/commands.js");
const fs = require("fs");
const Model = require("../src/model/Model.js");
//to run this test file run the following command:
//npm test tests/FileSystemCommands.test.js
describe("Test Save Function", () => {
  test("returns false when no puzzle is open", () => {
    const Model = {
      // Store whether the player currently has a puzzle open
      isPuzzleOpen: false,

      // Stores all the words found by the user.
      foundWords: [],

      // Stores the seven letter puzzle
      pangram: "",

      // Stores the puzzle as an array of letters in a random order
      currentPuzzle: [],

      // Stores the letter that is required in the puzzle
      requiredLetter: "",

      // Stores the users points
      userPoints: 0,

      // Possible guesses
      possibleGuesses: [],

      // Max user points
      maxPoints: 0,
    };

    expect(Commands.save("Game1", Model)).toEqual(false);
  });

  test("creates a new file when it does not exist", () => {
    const writeFileSpy = jest
      .spyOn(fs, "writeFileSync")
      .mockImplementation((path, data, encoding, callback) => {
        callback();
      });

    const Model = {
      // Store whether the player currently has a puzzle open
      isPuzzleOpen: true,

      // Stores all the words found by the user.
      foundWords: ["pine"],

      // Stores the seven letter puzzle
      pangram: "pinewood",

      // Stores the puzzle as an array of letters in a random order
      currentPuzzle: ["e", "n", "i", "p", "d", "o", "w"],

      // Stores the letter that is required in the puzzle
      requiredLetter: "e",

      // Stores the users points
      userPoints: 0,

      // Possible guesses
      possibleGuesses: ["pinewood"],

      // Max user points
      maxPoints: 0,
    };

    expect(Commands.save("Game1", Model)).toEqual(true);
    expect(writeFileSpy).toHaveBeenCalled();
  });

  test("returns false when filename is empty string", () => {
    const Model = {
      // Store whether the player currently has a puzzle open
      isPuzzleOpen: true,

      // Stores all the words found by the user.
      foundWords: ["pine"],

      // Stores the seven letter puzzle
      pangram: "pinewood",

      // Stores the puzzle as an array of letters in a random order
      currentPuzzle: ["e", "n", "i", "p", "d", "o", "w"],

      // Stores the letter that is required in the puzzle
      requiredLetter: "e",

      // Stores the users points
      userPoints: 0,

      // Possible guesses
      possibleGuesses: ["pinewood"],

      // Max user points
      maxPoints: 0,
    };

    expect(Commands.save("", Model)).toEqual(false);
  });
});
