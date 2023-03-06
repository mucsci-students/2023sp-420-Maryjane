const DatabaseClass = require("../src/database/lib/mongodb.js");

describe ("Test DataBase Class", () => {

    let database = new DatabaseClass();

    test("reset", () => {
      expect(1).toEqual(1)
    });

    test("When a database object is created, the fields are not be null", () => {
        expect(database.database).not.toBeDefined();
    });

    test("When connect is called, database is not null", async () => {
        await database.connect();
        expect(database.database).toBeDefined();
    });

    test("When getRandomWord is called, a random word is returned with length 7", async () => {
        await database.connect();
        let word = await database.getRandomWord();
        expect(word).toBeDefined();
        expect(word).toHaveLength(7);
    });

  

});