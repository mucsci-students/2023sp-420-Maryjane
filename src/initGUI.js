//const { shuffle } = require('./classes/Commands.js');

let GUI_View = require('./views/GUI_View.js');
let Model = require('./model/Model.js');
let GUI_Controller = require('./controllers/GUI_Controller.js');

let view = new GUI_View();
view.newPuzzleFromBase("pinewod");

let model = new Model();
model.isPuzzleOpen = true;

let controller = new GUI_Controller(model, view);

// Make this function global by assigning it to the window.
function shuffle() {
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

function enterLetter() 
{
  view.enterLetter();
}

// Put anything in here that you want to be able to access in the html or console.
module.exports = {
  controller: controller,
  view: view,
  model: model,
  shuffle: shuffle
};
