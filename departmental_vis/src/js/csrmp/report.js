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
  this.registerSelectionChangeCallback(bindListener(this, this._onSelectionChange));
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

Report.prototype._onSelectionChange = function(department) {
  var table;
  if(department === this._cs) {
    table = this._deptsTable;
  } else {
    table = new components.ProjectsTable(this, department.projects());
  }
  this._layout.replaceTable(table);
},


Report.prototype.init = function() {
  this._repo.getDepartmentsGraph(bindListener(this, function(cs) {
    this._cs = cs;
    var depts = cs.children();
    this._deptsTable = new components.DepartmentsTable(this, depts);
    var deptBudgetPie = new components.BudgetPie(this, cs);
    var ratingsHistogram = new components.RatingsHistogram(this);
    var deptsOverview = new components.DepartmentOverview(this, deptBudgetPie, ratingsHistogram);
    var breadcrumb = new components.Breadcrumb(this, cs);
    this._layout = new components.Layout(deptsOverview, this._deptsTable, breadcrumb);
    this._layout.render("#" + this._nodeId);
    this.setSelection(cs);
  }));
};
