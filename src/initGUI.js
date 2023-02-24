//const { shuffle } = require('./classes/Commands.js');

let GUI_View = require('./views/GUI_View.js');
let Model = require('./model/Model.js');
let GUI_Controller = require('./controllers/GUI_Controller.js');
let Commands = require('./classes/Commands.js');
let isWord = require('./dict.js');

let model = new Model();

let view = new GUI_View(model);

Commands.identifyBaseWord('pinewood', model, view);

let controller = new GUI_Controller(model, view);

console.log(isWord("hello"));

// Put anything in here that you want to be able to access in the html or console.
module.exports = {
  controller: controller,
  view: view,
  model: model
};
