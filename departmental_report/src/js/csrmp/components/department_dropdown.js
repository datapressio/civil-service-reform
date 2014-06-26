var render = require("../util/render")
var fs = require("fs");
var _ = require("underscore");
var events = require("dom-events");
var bindListener = require("../util/bind_listener")

var DepartmentDropdown = module.exports = function(report, departments) {
  this._report = report;
  this._departments = departments;
}

DepartmentDropdown.prototype._template = fs.readFileSync(__dirname + "/../../../templates/department_dropdown.mustache", 'utf8');

DepartmentDropdown.prototype.render = function(selector) {
  this._element = render(this._template, selector, this._templateParams());
  events.on(this._element, "change", bindListener(this, this._changeSelection));
}


DepartmentDropdown.prototype._templateParams = function() {
  return {
    departments: _.map(this._departments, function(dept) {
      return { label : dept.label(), id : dept.key() };
    })
  };
}

DepartmentDropdown.prototype._changeSelection = function(event) {
  this._report.setSelection(this._departmentById(event.target.value));
};

DepartmentDropdown.prototype._departmentById = function(id) {
  var dept = _.find(this._departments, function(dept) { return dept.key() == id });
  return dept;
};
