var d3 = require("d3-browserify");
var data = require("./data");
var components = require("./components");
var models = require("./models")
var Visualisation = module.exports = function(selector) {
  this._selector = selector;
  this._repo = new data.Repository();
};

Visualisation.prototype.render = function() {
  var svg = d3.select(this._selector).append("svg").append("g");
  this._repo.getDepartmentsGraph(function(cs) {
    var graphVis = new components.Graph(new models.Tree(cs), svg);
    graphVis.render();
  });
};
