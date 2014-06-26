var slick = require("slick");
var _ = require("underscore");
var bindListener = require("../util/bind_listener");
var d3 = require("d3-browserify");

RatingsHistogram = module.exports = function(report) {
 this._report = report;
 this._report.registerSelectionChangeCallback(bindListener(this, this._onSelectionChange));
}

RatingsHistogram.prototype.render = function(selector) {
  this._element = slick.find(selector);
}

RatingsHistogram.prototype._onSelectionChange = function(selection) {
  dept = selection._root;
  var data = [dept.red_count(), dept.amber_red_count(), dept.amber_count(), dept.amber_green_count(), dept.green_count()];

  var maxValue = _.max(data);

  var colors = [
    "#e54545",
    "url(\"#amberRedHatch\")",
    "#e5ba39",
    "url(\"#amberGreenHatch\")",
    "#2bab2b"
  ]


  this._element.innerHTML = "";
  var width = this._element.offsetWidth;
  var height = 400
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1)
      .domain([0, 1,2,3,4]);

  var y = d3.scale.linear()
      .range([0, height])
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



  var defs = svg.append('defs');
  var pattern = defs.append('pattern')
    .attr('id', 'amberGreenHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4);
  pattern.append('rect')
    .attr('fill', colors[4])
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("x", 0)
    .attr("y", 0);
  pattern.append('path')
    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
    .attr('stroke', colors[2])
    .attr('stroke-width', 1.25);

  var pattern = defs.append('pattern')
    .attr('id', 'amberRedHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4);
  pattern.append('rect')
    .attr('fill', colors[0])
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("x", 0)
    .attr("y", 0);
  pattern.append('path')
    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
    .attr('stroke', colors[2])
    .attr('stroke-width', 1.25);


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
      .attr("height", function(d) { return height - y(d) })
      .style("fill", function(d) {return colors[_.indexOf(data, d)]; });
}

