var slick = require("slick");
var _ = require("underscore");
var bindListener = require("../util/bind_listener");
var d3 = require("d3-browserify");
var Patterns = require("./Patterns")
var colors = require("../util/colors")
var models = require("../models")

RatingsHistogram = module.exports = function(report) {
 this._report = report;
 this._report.registerSelectionChangeCallback(bindListener(this, this._onSelectionChange));
}

RatingsHistogram.prototype.render = function(selector) {
  this._element = slick.find(selector);
}

RatingsHistogram.prototype._onSelectionChange = function(dept) {
  if(!(dept instanceof models.Department)) return;
  var data = [dept.red_count(), dept.amber_red_count(), dept.amber_count(), dept.amber_green_count(), dept.green_count()];
  var projects = [dept.red_projects(), dept.amber_red_projects(), dept.amber_projects(), dept.amber_green_projects(), dept.green_projects()];
  var maxValue = _.max(data);

  var colorNames = [
    "Red",
    "Amber/Red",
    "Amber",
    "Amber/Green",
    "Green"
  ]


  this._element.innerHTML = "";
  var width = this._element.offsetWidth;
  var height = this._element.offsetHeight;
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1)
      .domain([0, 1,2,3,4]);

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, maxValue]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);


  var svg = d3.select(this._element).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")

  var p = new Patterns()
  p.render();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

 svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(_.indexOf(data, d)); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d); })
      .attr("height", function(d) { return height - y(d); })
      .style("fill", function(d) {return colors[colorNames[_.indexOf(data, d)]]; })
      .on("click", bindListener(this, function(d) {
        var ps = _.sortBy(projects[_.indexOf(data, d)], function(project) {
          return - project.cash_budget(); 
        });
        this._report.setSelection(ps);
      }))
}

