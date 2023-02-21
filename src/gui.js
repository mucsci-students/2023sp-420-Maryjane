//const { shuffle } = require('./classes/Commands.js');
let GUI_View = require('./views/GUI_View.js');

let view = new GUI_View();
view.newPuzzleFromBase("pinewod");

// Make this function global by assigning it to the window.
window.shuffle = function() {
  let a = "pinewood".split("")
  // Bad shuffle found online, convert to ours
  n = a.length;

  for(let i = n - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  a = a.join("");
  view.newPuzzleFromBase(a);
}
