
// Used to keep track of all things related to the puzzle/game
class Commands {

  static guess(input, GameManager) {
    //Converts input to a string
    input = input + '';
    input = input.toLowerCase();

    if (!GameManager.isPuzzleOpen) {
      console.log('No puzzle in progress');
      return;
    }

    if (input.length < 4) {
      console.log('Guess must be at least 4 characters');
      return;
    }

    // Check that the input has the required lettter
    if (input.search(GameManager.requiredLetter.toLowerCase()) === -1) {
      console.log('Guess must contain required character\nThe required character is', GameManager.requiredLetter);
      return;
    }

    // Check that all letters of the input are allowed letters determined by the pangram
    for (let i = 0; i < input.length; i++) {
      if (GameManager.pangram.search(input.charAt(i)) === -1) {
        console.log(input.charAt(i) + " is not in the required letters");
        return;
      }
    }

    console.log('success');

    // Check that guess is not in the found words

    // Check that the guess is a real word

    // Insert the guess into list of found words and increase user points

  }

}

module.exports = Commands;
