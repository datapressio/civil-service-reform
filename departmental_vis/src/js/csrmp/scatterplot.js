var data = require("./data");
var components = require("./components");
var _ = require("underscore");
var bindListener = require("./util/bind_listener");

var Scatterplot = module.exports = function(selector) {
  this._selector = selector;
  this._projectSelection = null;
  this._departmentSelections = [];
  this._repo = new data.Repository();
  this._projectSelectionCallbacks = [];
  this._departmentSelectionCallbacks = [];
}

Scatterplot.prototype = {
  removeDepartmentSelections: function(removed) {
    this._departmentSelections = _.difference(this._departmentSelections, removed);
    _.each(this._departmentSelectionCallbacks, bindListener(this, function(callback) {
      callback([], removed, this._departmentSelections);
    }));
  },

  addDepartmentSelections: function(added) {
    this._departmentSelections = _.union(this._departmentSelections, added);
    _.each(this._departmentSelectionCallbacks, bindListener(this, function(callback) {
      callback(added, [], this._departmentSelections);
    }));
  },

  toggleDepartmentSelection: function(selection) {
    _.include(this._departmentSelections, selection) ? this.removeDepartmentSelections([selection]) : this.addDepartmentSelections([selection]);
  },

  registerDepartmentSelectionCallback: function(callback) {
    this._departmentSelectionCallbacks.push(callback);
  },

  setProjectSelection: function(projectSelection, department) {
    this._projectSelection = projectSelection;
    _.each(this._projectSelectionCallbacks, bindListener(this, function(callback) {
      callback(this._projectSelection, department)
    }));
  },

  registerProjectSelectionCallback : function(callback) {
    this._projectSelectionCallbacks.push(callback);
  },

  render: function() {
    this._repo.getDepartmentsGraph(bindListener(this, function(cs) {
      var departments = cs.children();
      var scatterplot = new components.Scatterplot(this, departments);
      var projectOverview = new components.ProjectOverview(this);
      var departmentsMultiSelect = new components.DepartmentsMultiSelect(this, departments);
      var layout = new components.DashboardLayout(scatterplot, projectOverview, departmentsMultiSelect);
      layout.render(this._selector);
      this.addDepartmentSelections(departments);
    }));;
  }
}
