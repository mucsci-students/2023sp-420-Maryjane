const ModelClass = require("../src/model/Model.js");
const ViewClass = require("../src/views/CLI_View");
const Commands = require("../src/commands/commands.js");

describe ("Test Guess Function", () => {
    
  // Setup gamemanager
  let Model = new ModelClass();
  let View = new ViewClass();

  test("When a puzzle is not open, return false", () => {
    Model.isPuzzleOpen = false;
    expect(Commands.guess("", Model, View)).toEqual(false)
    expect(Commands.guess("pine", Model, View)).toEqual(false)
  });

  test("When the guess is an empty string, return false", () => {
    Model.isPuzzleOpen = true;
    expect(Commands.guess("", Model, View)).toEqual(false);
  });

  test("When the guess is less than 4 characters, return false", () => {
    expect(Commands.guess("pie", Model, View)).toEqual(false)
  });

  test("When the guess is an empty string, return false", () => {
    expect(Commands.guess("", Model, View)).toEqual(false)
  });

  Model.currentPuzzle = ['p', 'i', 'n', 'e', 'w', 'o', 'd'];
  Model.requiredLetter = 'i';
  Model.pangram = 'pinewood';
  Model.possibleGuesses = ['PINE', 'PINEWOOD'];

  test("When the guess does not contain the required letter, return false", () => {
    expect(Commands.guess("wood", Model, View)).toEqual(false)
  });

  test("When the guess uses a letter that is not in the pangram, return false", () => {
    expect(Commands.guess("pines", Model, View)).toEqual(false)
  });

  test("When the user makes a valid guess, should return true and found words length should be 1", () => {
    expect(Commands.guess("pine", Model, View)).toEqual(true);
    expect(Model.foundWords.length).toEqual(1);
  });

  test("When the user makes a guess that has already been guess, return false and foundwords length does not change", () => {
    let prevLength = Model.foundWords.length;
    expect(Commands.guess("pine", Model, View)).toEqual(false);
    expect(Model.foundWords.length).toEqual(prevLength);
  });

  test("When the user makes a guess that is not from the dictionary, return false", () => {
    let prevLength = Model.foundWords.length;
    expect(Commands.guess("ninen", Model, View)).toEqual(false);
    expect(Model.foundWords.length).toEqual(prevLength);
  });

  test("When the user enters a pangram, the success message function is called", () => {
    let prevLength = Model.foundWords.length;
    let spy = jest.spyOn(View, 'showPangramMessage');
    expect(Commands.guess("PINEWOOD", Model, View)).toEqual(true);
    expect(Model.foundWords.length).not.toEqual(prevLength);
    expect(Model.foundWords.length).toEqual(2);
    expect(spy).toHaveBeenCalled();
  });

});
