//const { MongoClient } = require("mongodb");
//const DatabaseClass = require("../src/classes/Database.js");

describe ("Test DataBase Class", () => {

    // let database = new DatabaseClass();

    test("reset", () => {
      expect(1).toEqual(1)
    });

    // test("When a database object is created, the fields are not be null", () => {
    //     expect(database.client).toBeDefined();
    //     expect(database.uri).toBeDefined();
    //     expect(database.database).not.toBeDefined();
    //     expect(database.pangramCollection).not.toBeDefined();
    // });

    // test("When connect is called, database and pangram collection are not null", async () => {
    //     await database.connect();
    //     expect(database.database).toBeDefined();
    //     expect(database.pangramCollection).toBeDefined();
    //     database.disconnect();
    // });

    // test("When getRandomWord is called, a random word is returned with length 7", async () => {
    //     await database.connect();
    //     let word = await database.getRandomWord();
    //     expect(word).toBeDefined();
    //     expect(word).toHaveLength(7);
    //     database.disconnect();
    // });

    // test("When the database client is incorrect, then the connect function will not connect", async () => {
    //     let database = new DatabaseClass();
    //     database.client = new MongoClient("mongodb+srv://marryjane:Spring420@maryjane.mnwjay4u.mongodb.net/?retryWrites=true&w=majority");
    //     await database.connect();
    //     expect(database.database).not.toBeDefined();
    //     expect(database.pangramCollection).not.toBeDefined();
    // });

});