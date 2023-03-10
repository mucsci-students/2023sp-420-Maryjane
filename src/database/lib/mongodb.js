// Autogenerated at by MongoDB

let database = require("../MaryJane.js");

class Mongodb {
  //Store database
  database;

  constructor() {}

  /**
   * Connects code to local mongoDB database named 'MaryJane'
   */
  connect() {
    this.database = database;
  }

  /**
   * Gets a random pangram from the database
   * @return {string} - The random pangram
   */
  getRandomWord() {
    let collection = this.database.clusters.collections.seven_letter_words;
    let randomIndex = Math.floor(Math.random() * collection.length);
    return collection[randomIndex].word.toString();
  }
}

module.exports = Mongodb;
