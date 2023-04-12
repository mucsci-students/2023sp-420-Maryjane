const fs = require("fs");
class fileSystem {
  /**
   * !!!THIS IS A DESIGN PATTERN THAT WE NEED TO PUT IN THE README
   * @param {string} fileName
   * @returns
   */
  static readJSONFile(fileName) {
    if (typeof window !== "undefined") {
      const reader = new FileReader();
      reader.addEventListener("load",
        (event) => {
          const jsonData = JSON.parse(event.target.result);
          return jsonData;
        });
      reader.readAsText(fileName);
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
module.exports = fileSystem ;
