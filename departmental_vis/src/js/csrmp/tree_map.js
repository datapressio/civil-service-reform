var d3 = require("d3-browserify");
var data = require("./data");
var components = require("./components");
var _ = require("underscore");
var bindListener = require("./util/bind_listener");

var Treemap = module.exports = function(selector) {
  this._selector = selector;
  this._selection = null;
  this._highlight = null;
  this._repo = new data.Repository();
  this._highlightCallbacks = [];
  this._selectionCallbacks = [];
}




Treemap.prototype = {

  setHighlight: function(highlight) {
    this._highlight = highlight
    _.each(this._highlightCallbacks, bindListener(this, function(callback) {
      callback(this._highlight)
    }));
  },

  setSelection: function(selection) {
    this._selection = selection
    _.each(this._selectionCallbacks, bindListener(this, function(callback) {
      callback(this._selection)
    }));
  },

  registerHighlightCallback : function(callback) {
    this._highlightCallbacks.push(callback);
  },

  registerSelectionCallback : function(callback) {
    this._selectionCallbacks.push(callback);
  },


  render : function() {
    var treeMap = new components.Treemap(this);
    var hoverBox = new components.Hoverbox(this);
    hoverBox.render(this._selector);
    treeMap.render(this._selector);
    this._repo.getGraph(bindListener(this, function(graph) {
      this.setSelection(graph._root); //FIXME
    }));
  }
}
