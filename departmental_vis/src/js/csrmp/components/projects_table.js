var fs = require("fs");
var _ = require("underscore");
var render = require("../util/render");

var ProjectsTable = module.exports = function(report, projects) {
  this._report = report;
  this._projects = projects;
}

ProjectsTable.prototype = {

  _template: fs.readFileSync(__dirname + "/../../../templates/projects_table.mustache", "utf8"),

  render: function(selector) {
    this._element = render(this._template, selector, this._templateParams());
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
  }


}
