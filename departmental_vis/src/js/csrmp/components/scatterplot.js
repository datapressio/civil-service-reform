var bindListener = require("../util/bind_listener");
var _ = require("underscore");
var colors = require("../util/colors");
var d3 = require("d3-browserify");
var slick = require("slick");
var Scatterplot = module.exports = function(vis, departments) {
  this._departments = departments;
  this._projects = _.flatten(_.map(this._departments, function(d) { return d.children(); }));
  this._vis = vis;
  this._vis.registerMultiSelectionCallback(bindListener(this, this._onSelectionChange));
}

Scatterplot.prototype = {
  render: function(selector) {

   this._element = slick.find(selector);
   this._width = this._element.offsetWidth;
   this._height = this._element.offsetHeight;

   this._xScale = d3.scale.linear()
     .range([0, this._width])
     .domain([d3.min(this._projects, this._xValue) - 1, d3.max(this._projects, this._xValue) + 1]);

   this._yScale = d3.scale.linear()
     .range([0, this._height])
     .domain([d3.min(this._projects, this._yValue) - 1, d3.max(this._projects, this._yValue) + 1]);

   this._svg = d3.select(this._element).append("svg")
      .attr("width", this._width)
      .attr("height", this._height)
      .append("g")

   this._pointsContainer = this._svg.append("g");

   this._renderAxes();
  },

  _renderAxes: function() {
    this._svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this._yScale(0) + ")")
        .call(
          d3.svg.axis().scale(this._xScale).orient("center")
        ).append("text")
        .attr("class", "label")
        .attr("x", this._width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Budget total (£m)");

    this._svg.append("g")
        .attr("class", "y axis")
        .call(
           d3.svg.axis().scale(this._yScale).orient("right")
        ).append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 36)
        .attr("x",  6 - this._height)
        .attr("dy", ".71em")
        .style("text-anchor", "start")
        .text("Forecast over/under spend(%)");

  },

  _onSelectionChange: function(added, removed, selected) {
    var projects = _.filter(
      _.flatten(
        _.map(selected,
          function(d) { return d.children(); })
      ), bindListener(this, function(d) {
        return this._xValue(d) && this._yValue(d) ;
      })
    );

    var dots = this._pointsContainer.selectAll(".dot")
      .data(projects);

    dots.enter().append("circle")
      .attr("class", "dot")
      .attr("r", 7)
      .attr("cx", _.compose(this._xScale, this._xValue))
      .attr("cy", _.compose(this._yScale, this._yValue))
      .style("fill", function(d) { return colors[d.rating()] })
      .on("mouseover", bindListener(this, function(d) {
        this._vis.setHighlight(d);
      }));

    dots.exit().remove();

  },

  _xValue: function(d) { return d.cash_budget();  },
  _yValue: function(d) { return d.percent_variance(); }
}
