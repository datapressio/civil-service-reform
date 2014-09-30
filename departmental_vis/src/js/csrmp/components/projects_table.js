var fs = require("fs");
var _ = require("underscore");
var render = require("../util/render");
var slick = require("slick");
var events = require("dom-events");
var bindListener = require("../util/bind_listener");

var ProjectsTable = module.exports = function(report, projects) {
  this._report = report;
  this._projects = projects;
}

ProjectsTable.prototype = {

  _template: fs.readFileSync(__dirname + "/../../../templates/projects_table.mustache", "utf8"),

  render: function(selector) {
    this._element = render(this._template, selector, this._templateParams());
    _.each(slick.search("tr.project", this._element), bindListener(this, function(row) {
      events.on(row, "click", bindListener(this, this._changeSelection));
    }));
  },

  _templateParams: function() {
    return {
      projects: _.map(this._projects, function(project) {
        return {
          id: project.id,
          label: project.label(),
          cash_budget: project.cash_budget() != null ? "£" + project.cash_budget() + "m" : "-",
          cash_forecast: project.cash_budget() != null ? "£" + project.cash_forecast() + "m" : "-",
          percent_variance: project.percent_variance() != null && project.percent_variance().toFixed ? project.percent_variance().toFixed(1) + "%" : "-",
          budget_proportion: project.parent_budget_proportion() != null ? (100 * project.parent_budget_proportion()).toFixed(1) + "%" : "-",
          rating_class:  project.rating() ? project.rating().replace(new RegExp("\\s*\\/\\s*"), "_").toLowerCase() : null
        }
      })
    }
  },

  _changeSelection: function(event) {
    var projectId = event.target.parentNode.className.match(/(project\-[0-9]+)/)[0];
    this._report.setSelection(this._projectById(projectId));
  },

  _projectById: function(id) {
    var project = _.find(this._projects, function(project) { return project.id == id });
    return project;
  }


}
