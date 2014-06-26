var render = require("../util/render")
var fs = require("fs");
var slick = require("slick");
var _ = require("underscore");
var bindListener = require("../util/bind_listener")
var dom = require("ampersand-dom");

var DepartmentOverview = module.exports = function(report, budgetPie, ratingsHistogram) {
  this._report = report
  this._budgetPie = budgetPie;
  this._ratingsHistogram = ratingsHistogram;
  this._report.registerSelectionChangeCallback(bindListener(this, this._onChangeSelection));
}

DepartmentOverview.prototype._template = fs.readFileSync(__dirname + "/../../../templates/department_overview.mustache", 'utf8');

DepartmentOverview.prototype._budgetPieSelector = ".budget_proportion";
DepartmentOverview.prototype._ratingsHistogramSelector = ".ratings_histogram";

DepartmentOverview.prototype.render = function(selector) {
  this._element = render(this._template, selector);
  this._budgetPie.render(selector + " " + this._budgetPieSelector);
  this._ratingsHistogram.render(selector + " " + this._ratingsHistogramSelector);
}

DepartmentOverview.prototype._onChangeSelection = function(selection) {
  var department = selection._root; //FIXME organize the model layer better.
  slick.find(".name", this._element).innerHTML = selection.label();
  slick.find(".projects_count .n", this._element).innerHTML = department.projects_count();
  slick.find(".over_budget_count .n", this._element).innerHTML = department.over_budget_count();
  slick.find(".under_budget_count .n", this._element).innerHTML = department.under_budget_count();
  slick.find(".total_budget .n", this._element).innerHTML = department.cash_budget();
  slick.find(".total_forecast .n", this._element).innerHTML = department.cash_forecast();

 var varianceElement = slick.find(".total_variance", this._element);
 slick.find(".n", varianceElement).innerHTML = Math.abs(department.percent_variance()).toFixed(0);
 if(department.percent_variance() > 0) {
   dom.addClass(varianceElement, "positive");
   dom.removeClass(varianceElement, "negative");
   dom.text(slick.find(".direction_label", varianceElement), "over")
 } else {
   dom.removeClass(varianceElement, "positive");
   dom.addClass(varianceElement, "negative");
   dom.text(slick.find(".direction_label", varianceElement), "under")
 }
};
