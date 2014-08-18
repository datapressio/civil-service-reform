var render = require("../util/render");
var fs = require("fs");


var Layout = module.exports = function(deptOverview, deptsTable, projectsHover) {
  this._deptOverview = deptOverview;
  this._deptsTable = deptsTable;
  this._projectsHover = projectsHover;
};

Layout.prototype._template = fs.readFileSync(__dirname + "/../../../templates/layout.mustache", 'utf8');
Layout.prototype._deptOverviewSelector = ".dept_overview";
Layout.prototype._deptsTableSelector = ".depts_table";
Layout.prototype._projectsHoverSelector = ".projects_hover";


Layout.prototype.render = function(selector) {
  render(this._template, selector);
  this._deptOverview.render(selector + " " + this._deptOverviewSelector);
  this._deptsTable.render(selector + " " + this._deptsTableSelector);
  this._projectsHover.render(selector + " " + this._projectsHoverSelector);
  //heading:    this._heading.render(),
  //projectsTable: this._projectsTable.render(),
  //ratingHistogram:  this._ratingHistogram.render(),
  //budgetBreakdown: this._budgetBreakdown.render(),
  //projectDetails: this._projectDetails.render(),
}
