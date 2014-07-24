var data = require("./data");
var components = require("./components");
var _ = require("underscore");
var bindListener = require("./util/bind_listener");

var Scatterplot = module.exports = function(selector) {
  this._selector = selector;
  this._highlight = null;
  this._selections = [];
  this._repo = new data.Repository();
  this._highlightCallbacks = [];
  this._selectionCallbacks = [];
}

Scatterplot.prototype = {
  removeSelections: function(removed) {
    this._selections = _.difference(this._selections, removed);
    _.each(this._selectionCallbacks, bindListener(this, function(callback) {
      callback([], removed, this._selections);
    }));
  },

  addSelections: function(added) {
    this._selections = _.union(this._selections, added);
    _.each(this._selectionCallbacks, bindListener(this, function(callback) {
      callback(added, [], this._selections);
    }));
  },

  toggleSelection: function(selection) {
    _.include(this._selections, selection) ? this.removeSelections([selection]) : this.addSelections([selection]);
  },

  registerMultiSelectionCallback: function(callback) {
    this._selectionCallbacks.push(callback);
  },

  setHighlight: function(highlight, department) {
    this._highlight = highlight
    _.each(this._highlightCallbacks, bindListener(this, function(callback) {
      callback(this._highlight, department)
    }));
  },

  registerHighlightCallback : function(callback) {
    this._highlightCallbacks.push(callback);
  },

  render: function() {
    this._repo.getDepartmentsGraph(bindListener(this, function(cs) {
      var departments = cs.children();
      var scatterplot = new components.Scatterplot(this, departments);
      var hoverBox = new components.Hoverbox(this);
      var departmentsMultiSelect = new components.DepartmentsMultiSelect(this, departments);
      var layout = new components.DashboardLayout(scatterplot, hoverBox, departmentsMultiSelect);
      layout.render(this._selector);
      this.addSelections(departments);
    }));;
  }
}
