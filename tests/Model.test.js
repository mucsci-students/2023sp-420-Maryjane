
const ModelClass = require("../src/model/Model.js");
const isWord = require("../src/model/dict.js");
const MongoDBClass = require("../src/model/database/lib/mongodb.js");
const { type } = require("os");

describe("Test Model class", () => {
  
  const Model = new ModelClass();

  test("should return correct rank name for given score", () => {
    expect(Model.getRankName(0.01)).toEqual("Newbie");
    expect(Model.getRankName(0.03)).toEqual("Novice");
    expect(Model.getRankName(0.06)).toEqual("Fine");
    expect(Model.getRankName(0.1)).toEqual("Skilled");
    expect(Model.getRankName(0.2)).toEqual("Excellent");
    expect(Model.getRankName(0.35)).toEqual("Superb");
    expect(Model.getRankName(0.45)).toEqual("Marvellous");
    expect(Model.getRankName(0.65)).toEqual("Outstanding");
    expect(Model.getRankName(1)).toEqual("Queen Bee");
  });

  test("should return 'Something went wrong' for invalid input", () => {
    expect(Model.getRankName(-1)).toEqual("Something went wrong");
    expect(Model.getRankName(2)).toEqual("Something went wrong");
    expect(Model.getRankName(NaN)).toEqual("Something went wrong");
    expect(Model.getRankName(undefined)).toEqual("Something went wrong");
    expect(Model.getRankName(null)).toEqual("Something went wrong");
    expect(Model.getRankName("string")).toEqual("Something went wrong");
  });

  it('should create only one instance of the Model class', () => {
    const instance1 = new ModelClass();
    const instance2 = new ModelClass();

    expect(instance1).toEqual(instance2);
  });

  test('shufflePuzzle should shuffle the puzzle when the puzzle is open', () => {
    Model.isPuzzleOpen = true;
    Model.currentPuzzle = ["P", "I", "N", "E", "W", "O", "D"];

    const originalPuzzle = [...Model.currentPuzzle];

    expect(Model.shufflePuzzle()).toBe(true);

    // Check if the array has been modified (shuffled)
    expect(Model.currentPuzzle).not.toEqual(originalPuzzle);

    // Check if the array still contains the same elements after shuffling
    expect(Model.currentPuzzle.sort()).toEqual(originalPuzzle.sort());
  });

  test('shufflePuzzle should not shuffle the puzzle when the puzzle is closed', () => {
    Model.isPuzzleOpen = false;
    Model.currentPuzzle = ["P", "I", "N", "E", "W", "O", "D"];

    const originalPuzzle = [...Model.currentPuzzle];

    expect(Model.shufflePuzzle()).toBe(false);

    // Check if the array has not been modified (not shuffled)
    expect(Model.currentPuzzle).toEqual(originalPuzzle);
  });
});

describe('Test dict.js', () => {
  test('should return true for words found in the English dictionary', () => {
    expect(isWord('apple')).toBe(true);
    expect(isWord('banana')).toBe(true);
    expect(isWord('orange')).toBe(true);
    expect(isWord('blueberry')).toBe(true);
  });

  test('should return false for words not found in the English dictionary', () => {
    expect(isWord('nonexistentword')).toBe(false);
    expect(isWord('aklsdfj')).toBe(false);
  });

  test('should be case-insensitive', () => {
    expect(isWord('Apple')).toBe(true);
    expect(isWord('BANANA')).toBe(true);
    expect(isWord('OrAnGe')).toBe(true);
  });

  test('should return false for non-string inputs', () => {
    expect(isWord(123)).toBe(false);
    expect(isWord(null)).toBe(false);
    expect(isWord(undefined)).toBe(false);
  });
});

describe('Test MongoDB.js', () => {
  let MongoDB = new MongoDBClass();

  test('database should be undefined before connecting', () => {
    expect(MongoDB.database).toBeUndefined();
  });

  test('database should be defined after connecting', () => {
    MongoDB.connect()
    expect(MongoDB.database).toBeDefined();
  });

  test('database should return random words that are in the English Dictionary', () => {
    MongoDB.connect()
    expect(isWord(MongoDB.getRandomWord())).toBeDefined();
  });


});
