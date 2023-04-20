const fs = require("fs");
class fileSystem {
  /**
   * !!!THIS IS A DESIGN PATTERN THAT WE NEED TO PUT IN THE README (Adapter)
   * @param {string} fileName
   * @returns
   */
  static readJSONFile(fileName) {
    if (typeof window !== "undefined") {
      return fetch(fileName)
        .then(response => response.json())
        .then(highScores => {
          console.log(highScores);
          return highScores;
        });
    } else {
      let fileContents = fs.readFileSync(fileName, "utf-8");

      // Parse the file contents as JSON
      try {
        return JSON.parse(fileContents);
      } catch (e) {
        console.log("SpellingBee> File is not a valid SpellingBee JSON file");
      }
    }
  }
}
module.exports = fileSystem;
