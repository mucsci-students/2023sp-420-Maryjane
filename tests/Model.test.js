
const ModelClass = require("../src/model/Model.js");

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
});
