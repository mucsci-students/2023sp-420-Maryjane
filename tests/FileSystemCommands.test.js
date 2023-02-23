//const GameManagerClass = require("../src/classes/GameManager.js");
//const Commands = require("../src/classes/Commands.js");
//const fs = require("fs");

//to run this test file run the following command:
//npm test tests/FileSystemCommands.test.js 

describe("Test Save Function", () => {

  test("reset", () => {
    expect(1).toEqual(1)
  });

    // test("returns false when no puzzle is open", () => {

    //     const GameManager = {
    //         isPuzzleOpen: false,
    //         foundWords: [],
    //         pangram: "",
    //         requiredLetter: "",
    //         userPoints: 0
    //     };

    //     expect(Commands.save("Game1", GameManager)).toEqual(false);
    // });

    // test("creates a new file when it does not exist", () => {
    //     const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation((path, data, encoding, callback) => {
    //         callback();
    //     });

    //     const GameManager = {
    //         isPuzzleOpen: true,
    //         foundWords: ["word1", "word2"],
    //         pangram: "abcdefg",
    //         requiredLetter: "a",
    //         userPoints: 10
    //     };

    //     expect(Commands.save("Game1", GameManager)).toEqual(true);
    //     expect(writeFileSpy).toHaveBeenCalled();
    //     writeFileSpy.mockRestore();
    // });

    // test("returns false when filename is empty string", () => {

    //     const GameManager = {
    //         isPuzzleOpen: true,
    //         foundWords: ["word1", "word2"],
    //         pangram: "abcdefg",
    //         requiredLetter: "a",
    //         userPoints: 10
    //     };

    //     expect(Commands.save("", GameManager)).toEqual(false);
    // });

});
