var _ = require("underscore");
var data = require("./data");
var components = require("./components");
var bindListener = require("./util/bind_listener");
var Report = module.exports = function (nodeId) {
  this._nodeId = nodeId;
  this._selectionChangeCallbacks = [];
  this._projectSelectionChangeCallbacks = [];
  this._selection = null;
  this._projectSelection = null;
  this._repo = new data.Repository();
};

Report.prototype.registerSelectionChangeCallback = function(callback) {
  this._selectionChangeCallbacks.push(callback);
}

Report.prototype.setSelection = function(selection) {
  this._selection = selection;
  _.each(this._selectionChangeCallbacks, bindListener(this, function(callback) {
    callback(this._selection);
  }));
}

Report.prototype.registerProjectSelectionCallback = function(callback) {
  this._projectSelectionChangeCallbacks.push(callback);
}

Report.prototype.setProjectSelection = function(projects) {
  this._projectSelection = projects;
  _.each(this._projectSelectionChangeCallbacks, bindListener(this, function(callback) {
    callback(this._projectSelection);
  }));
}


Report.prototype.init = function() {
  this._repo.getDepartmentsGraph(bindListener(this, function(cs) {
    var depts = [cs].concat(cs.children());
    var projectsList = new components.ProjectsList(this);
    var projectsHover = new components.Hoverbox(this, projectsList);
    var deptsTable = new components.DepartmentsTable(this, depts);
    var deptBudgetPie = new components.BudgetPie(this, cs);
    var ratingsHistogram = new components.RatingsHistogram(this);
    var deptsOverview = new components.DepartmentOverview(this, deptBudgetPie, ratingsHistogram);
    var layout = new components.Layout(deptsOverview, deptsTable, projectsHover);
    layout.render("#" + this._nodeId);
    this.setSelection(cs);
  }));
};
