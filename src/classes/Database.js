/**
 * File is used to store everything related to the database
 */

// Import mongoDB package
const { MongoClient } = require("mongodb");

/**
 * Class used to connect and access the database
 */
class Database {
  //Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect  * your cluster. See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
  uri =
    "mongodb+srv://marryjane:Spring420@maryjane.mnwjy4u.mongodb.net/?retryWrites=true&w=majority";
  //Client user for the database
  client = new MongoClient(this.uri);
  //Store database
  database;
  //Store 7 letter word collection
  pangramCollection;

  //Default Constructor
  constructor() {}

  /**
   * Connects code to mongoDB database named 'MaryJane'
   */
  async connect() {
    try {
      // Connect to the MongoDB cluster
      await this.client.connect();
      this.database = this.client.db('MarryJane');
      this.pangramCollection = this.database.collection('seven_letter_words');
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Disconects code to mongoDB database named 'MaryJane'
   */
  async disconnect() {
    await this.client.close();
  }

  /**
   * Find a random document in the collection and return the word from it
   * api docs used: https://mongodb.github.io/node-mongodb-native/5.0/ 
   * @returns a random word from the collection
   */
  async getRandomWord() {
    // Returns a cursor to a list of documents. In this case, limit it to one.
    let cursor = await this.pangramCollection.aggregate([{ $sample: { size: 1 } }]);
    // Get the document by using the next() method
    let document = await cursor.next();
    // Close the cursor to free up resources
    cursor.close()
    // Return the word from the document
    return document.word;
  }

}

module.exports = Database;
