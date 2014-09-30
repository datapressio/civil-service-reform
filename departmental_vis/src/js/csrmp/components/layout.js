var render = require("../util/render");
var fs = require("fs");
var slick = require("slick");
var dom = require("ampersand-dom");

var Layout = module.exports = function(deptOverview, deptsTable, breadcrumb) {
  this._deptOverview = deptOverview;
  this._deptsTable = deptsTable;
  this._breadcrumb = breadcrumb;
};

Layout.prototype._template = fs.readFileSync(__dirname + "/../../../templates/layout.mustache", 'utf8');
Layout.prototype._deptOverviewSelector = ".dept_overview";
Layout.prototype._deptsTableSelector = ".depts_table";
Layout.prototype._breadcrumbSelector = ".breadcrumb";

Layout.prototype.render = function(selector) {
  render(this._template, selector);
  this._deptOverview.render(selector + " " + this._deptOverviewSelector);
  this._deptsTable.render(selector + " " + this._deptsTableSelector);
  this._breadcrumb.render(selector + " " + this._breadcrumbSelector);
}

Layout.prototype.replaceTable = function(table) {
  var tableContainer = slick.find(this._deptsTableSelector);
  dom.html(tableContainer, "");
  table.render(this._deptsTableSelector);
}

Layout.prototype.replaceOverview = function(overview) {
  var overviewContainer = slick.find(this._deptOverviewSelector);
  dom.html(overviewContainer, "");
  overview.render(this._deptOverviewSelector);
}
