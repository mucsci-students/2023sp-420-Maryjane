
let Commands = require('./classes/Commands.js');

let Model = new (require('./model/Model.js'))();
let View = new (require('./views/GUI_View.js'))(Model);
let Controller = new (require('./controllers/GUI_Controller.js'))(Model, View);

Commands.identifyBaseWord('pinewood', Model, View);

// Put anything in here that you want to be able to access in the html or console.
module.exports = {
  Controller: Controller,
  View: View,
  Model: Model
};
