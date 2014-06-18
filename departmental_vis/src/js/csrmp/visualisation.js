var d3 = require("d3-browserify");
var data = require("./data");
var components = require("./components");

var Visualisation = module.exports = function(selector) {
  this._selector = selector;
  this._repo = new data.Repository();
};

Visualisation.prototype.render = function() {
  var svg = d3.select(this._selector).append("svg").append("g");
  this._repo.getGraph(function(graph) {
    var graphVis = new components.Graph(graph, svg);
    graphVis.render();
  });
};
