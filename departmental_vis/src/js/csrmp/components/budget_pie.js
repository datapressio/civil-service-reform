var render = require("../util/render")
var fs = require("fs");
var slick = require("slick");
var _ = require("underscore");
var bindListener = require("../util/bind_listener");
var d3 = require("d3-browserify");

var BudgetPie = module.exports = function(report, parentDept) {
  this._report = report;
  this._parentDept = parentDept;
  this._report.registerSelectionChangeCallback(bindListener(this, this._onSelectionChange));
}

BudgetPie.prototype._template = fs.readFileSync(__dirname + "/../../../templates/budget_pie.mustache", 'utf8');

BudgetPie.prototype.render = function(selector) {
  this._element = render(this._template, selector);
  this._initD3();
}

BudgetPie.prototype._initD3 = function() {
  var width = this._element.offsetWidth;
  var height = this._element.offsetWidth;
  var radius = width /2;
  var svg = d3.select(slick.find(".chart", this._element))
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  this._layout = d3.layout.pie()
   .sort(null)
   .value(bindListener(this, function(d) {
    return d.dept ? this._parentDept.cash_budget() : 0;
  }));

  this._arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);


  this._slice = svg.datum(this._data).selectAll("path").data(this._layout)
    .enter().append("path")
      .style("fill", function(d) { return d.data.color; })
      .attr("d", this._arc);

  this._label = svg.append("text")
    .text("100%");

}

BudgetPie.prototype._onSelectionChange = function(dept) {
  this._layout.value(bindListener(this, function(d) {
    return d.dept ? dept.cash_budget() : this._parentDept.cash_budget() - dept.cash_budget();
  }));
  this._slice.data(this._layout);
  this._slice.attr("d", this._arc);
  percentage = dept.cash_budget() / this._parentDept.cash_budget() * 100;
  this._label.text(percentage.toFixed(1)+ "%")
}

BudgetPie.prototype._data = [
  { color: "#009ade", dept: true },
  { color: "#eeeeee", dept: false}
];
