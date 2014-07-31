var render = require("../util/render");
var fs = require("fs");
var _ = require("underscore");
var slick = require("slick");
var events = require("dom-events");
var bindListener = require("../util/bind_listener");

var DepartmentsTable = module.exports = function(report, departments) {
  this._report = report;
  this._departments = departments;
}
DepartmentsTable.prototype = {

  _template: fs.readFileSync(__dirname + "/../../../templates/departments_table.mustache", "utf8"),

  render: function(selector) {
    this._element = render(this._template, selector, this._templateParams());
    _.each(slick.search("tr.department", this._element), bindListener(this, function(row) {
      events.on(row, "click", bindListener(this, this._changeSelection));
    }));
    _.each(slick.search("th"), bindListener(this, function(header) {
      events.on(header, "click", bindListener(this, this._changeSort));
    }));
  },


  //FIXME pull out rating_Class to dedupe
  _templateParams: function() {
    return {
      departments: _.map(this._departments, function(dept) {
        return {
          id: dept.id,
          label: dept.label(),
          projects_count: dept.projects_count(),
          cash_budget: "£" + dept.cash_budget() + "m",
          cash_forecast: "£" + dept.cash_forecast() + "m",
          percent_variance: dept.percent_variance().toFixed(1) + "%",
          budget_proportion: (100 * dept.parent_budget_proportion()).toFixed(1) + "%",
          rating_class:  dept.rating() ? dept.rating().replace(new RegExp("\\s*\\/\\s*"), "_").toLowerCase() : null,
        };
      })
    };
  },

  _changeSelection: function(event) {
    var departmentId = event.target.parentNode.className.match(/department\-[0-9]+/)[0];
    this._report.setSelection(this._departmentById(departmentId));
  },

  _changeSort: function(event) {
    var field;
    var currentDirection;
    //OI START HERE TIM
 },

  _departmentById: function(id) {
    var dept = _.find(this._departments, function(dept) { return dept.key() == id });
    return dept;
  }

}
