var _ = require("underscore");
var data = require("./data");
var components = require("./components");
var bindListener = require("./util/bind_listener");
var Report = module.exports = function (nodeId) {
  this._nodeId = nodeId;
  this._selectionChangeCallbacks = [];
  this._selection = null;
  this._repo = new data.Repository();
};

Report.prototype.registerSelectionChangeCallback = function(callback) {
  this._selectionChangeCallbacks.push(callback);
}

Report.prototype.setSelection = function(selection) {
  this._selection = selection
  _.each(this._selectionChangeCallbacks, bindListener(this, function(callback) {
    callback(this._selection)
  }));
}


Report.prototype.init = function() {
  this._repo.getGraph(bindListener(this, function(graph) {
    var depts = graph.neighbourNodes();
    var cs = _.find(depts, function(dept) { return dept.key() == 'cs'});
    var deptsTable = new components.DepartmentsTable(this, depts);
    var deptBudgetPie = new components.BudgetPie(this, cs);
    var ratingsHistogram = new components.RatingsHistogram(this);
    var deptsOverview = new components.DepartmentOverview(this, deptBudgetPie, ratingsHistogram);
    var layout = new components.Layout(deptsOverview, deptsTable);
    layout.render("#" + this._nodeId);
    this.setSelection(graph);
  }));
};
