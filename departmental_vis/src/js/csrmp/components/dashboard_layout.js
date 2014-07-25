var render = require("../util/render");
var fs = require("fs");

var DashboardLayout = module.exports = function(scatterplot, projectOverview, departmentsMultiSelect) {
  this._scatterplot = scatterplot;
  this._projectOverview = projectOverview;
  this._departmentsMultiSelect = departmentsMultiSelect;
}

DashboardLayout.prototype = {

  _template: fs.readFileSync(__dirname + "/../../../templates/dashboard_layout.mustache", "utf8"),

  _scatterplotSelector: ".scatterplot_container",
  _multiselectSelector: ".multiselect_container",
  _projectOverviewSelector: ".project_overview_container",

  render: function(selector) {
    render(this._template, selector);
    this._scatterplot.render(selector + " " + this._scatterplotSelector);
    this._departmentsMultiSelect.render(selector + " " + this._multiselectSelector);
    this._projectOverview.render(selector + " " + this._projectOverviewSelector);
  }
}
