var bindListener = require("../util/bind_listener");
var _ = require("underscore");
var colors = require("../util/colors");
var d3 = require("d3-browserify");
var slick = require("slick");
var Scatterplot = module.exports = function(vis) {
  this._vis = vis;
  this._vis.registerMultiSelectionCallback(bindListener(this, this._onSelectionChange));
}

Scatterplot.prototype = {
  render: function(selector) {
   this._element = slick.find(selector);
   this._width = this._element.offsetWidth;
   this._height = this._element.offsetHeight;

   this._xScale = d3.scale.linear().range([0, this._width])
   this._yScale = d3.scale.linear().range([0, this._height])

   this._svg = d3.select(this._element).append("svg")
      .attr("width", this._width)
      .attr("height", this._height)
      .append("g")

   this._renderAxes();

  },

  _renderAxes: function() {
    this._svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this._height + ")")
        .call(
          d3.svg.axis().scale(this._xScale).orient("bottom")
        ).append("text")
        .attr("class", "label")
        .attr("x", this._width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Forecast over/under spend(%)");

    this._svg.append("g")
        .attr("class", "y axis")
        .call(
           d3.svg.axis().scale(this._yScale).orient("left")
        ).append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Budget total (£m)");

  },

  _onSelectionChange: function(added, removed, selected) {
    //FIXME the constructor should probably take the entire dataset and
    //initialize this to start with. Possibly also pre-render all points hidden
    //and then hide and show in here
    var projects = _.filter(
      _.flatten(
        _.map(selected,
          function(d) { return d.children(); })
      ), bindListener(this, function(d) {
        return this._xValue(d) && this._yValue(d) ;
      })
    );
    this._xScale.domain([d3.min(projects, this._xValue) - 1, d3.max(projects, this._xValue) + 1]);
    this._yScale.domain([d3.min(projects, this._yValue) - 1, d3.max(projects, this._yValue) + 1]);

    var dots = this._svg.selectAll(".dot")
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
