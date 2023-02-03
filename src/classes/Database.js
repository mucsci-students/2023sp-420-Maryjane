const { MongoClient } = require("mongodb");

class Database {
  //uri to connect to database path
  uri =
    "mongodb+srv://marryjane:Spring420@maryjane.mnwjy4u.mongodb.net/?retryWrites=true&w=majority";
  //Client user for the database
  client = new MongoClient(uri);

  //Basic Constructor
  constructor() {}

  /**
   * Connects code to mongoDB database named 'MaryJane'
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect  * your cluster. See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
  async connect() {
    try {
      // Connect to the MongoDB cluster
      await client.connect();
      // Make the appropriate DB calls
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Disconects code to mongoDB database named 'MaryJane'
   */
  async disconnect() {
    await client.close();
  }
}

module.exports = Database;
