var _ = require("underscore");
var data = require("./data");
var components = require("./components");
var models = require("./models");
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

Report.prototype._onSelectionChange = function(department) {
  if(department === this._cs) {
    var table = this._deptsTable;
    this._layout.replaceTable(table);
    this._layout.replaceOverview(this._deptsOverview);
  } else if(Array.isArray(department)) {
    //HAXX! department is actually a list of projects - to support filtering by dept and status. FIXME.
    var table = new components.ProjectsTable(this, department);
    this._layout.replaceTable(table);
  } else if(department instanceof models.Department) {
    var table = new components.ProjectsTable(this, department.projects());
    this._layout.replaceTable(table);
    this._layout.replaceOverview(this._deptsOverview);
  } else {
    //FURTHER HAXX!! department is actually a project, lol. FIXME.
    var overview = new components.ProjectOverview(this);
    this._layout.replaceOverview(overview);
    overview._onHighlightChange(department); //FIXME this is horrible.
  }
},


Report.prototype.init = function() {
  this._repo.getDepartmentsGraph(bindListener(this, function(cs) {
    this._cs = cs;
    var depts = cs.children();
    this._deptsTable = new components.DepartmentsTable(this, depts);
    var deptBudgetPie = new components.BudgetPie(this, cs);
    var ratingsHistogram = new components.RatingsHistogram(this);
    this._deptsOverview = new components.DepartmentOverview(this, deptBudgetPie, ratingsHistogram);
    var breadcrumb = new components.Breadcrumb(this, cs);
    this._layout = new components.Layout(this._deptsOverview, this._deptsTable, breadcrumb);
    this._layout.render("#" + this._nodeId);
    this.setSelection(cs);
  }));
};
