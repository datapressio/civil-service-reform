var render = require("../util/render")
var fs = require("fs");


var Layout = module.exports = function(deptsDropdown, deptOverview) {
  this._deptsDropdown = deptsDropdown;
  this._deptOverview = deptOverview;
};

Layout.prototype._template = fs.readFileSync(__dirname + "/../../../templates/layout.mustache", 'utf8');
Layout.prototype._deptsDropdownSelector = ".depts_dropdown";
Layout.prototype._deptOverviewSelector = ".dept_overview";

Layout.prototype.render = function(selector) {
  render(this._template, selector);
  this._deptsDropdown.render(selector + " " + this._deptsDropdownSelector);
  this._deptOverview.render(selector + " " + this._deptOverviewSelector);
  //heading:    this._heading.render(),
  //projectsTable: this._projectsTable.render(),
  //ratingHistogram:  this._ratingHistogram.render(),
  //budgetBreakdown: this._budgetBreakdown.render(),
  //projectDetails: this._projectDetails.render(),
}
