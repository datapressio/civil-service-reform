var bindListener = require("../util/bind_listener");
var _ = require("underscore");
var colors = require("../util/colors");
var d3 = require("d3-browserify");
var slick = require("slick");
var Scatterplot = module.exports = function(vis, departments) {
  this._departments = departments;
  this._projects = _.flatten(_.map(this._departments, function(d) { return d.children(); }));
  this._vis = vis;
  this._vis.registerDepartmentSelectionCallback(bindListener(this, this._onDepartmentSelectionChange));
  this._vis.registerProjectSelectionCallback(bindListener(this, this._onProjectSelectionChange));
  this._vis.registerDepartmentHighlightCallback(bindListener(this, this._onDepartmentHighlightChange));
}

Scatterplot.prototype = {

  _margin: 30,

  render: function(selector) {

   this._element = slick.find(selector);
   this._width = this._element.offsetWidth - 2 * this._margin;
   this._height = this._element.offsetHeight - 2 * this._margin;

   this._xScale = d3.scale.log().clamp(true)
     .range([1, this._width])
     .domain([1, d3.max(this._projects, this._xValue) + 1]);

     //this._xScale = d3.scale.linear()
   //  .range([0, this._width])
   //  .domain([d3.min(this._projects, this._xValue) - 1, d3.max(this._projects, this._xValue) + 1]);

   this._yScale = d3.scale.linear()
     .range([this._height, 0])
     .domain([d3.min(this._projects, this._yValue) - 1, d3.max(this._projects, this._yValue) + 1]);

   this._svg = d3.select(this._element).append("svg")
      .attr("width", this._width + 2 * this._margin)
      .attr("height", this._height + 2 * this._margin)
      .append("g").attr("transform", "translate("+this._margin+","+this._margin+")")

   this._pointsContainer = this._svg.append("g");

   this._renderAxes();
  },

  _renderAxes: function() {
    this._svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this._yScale(0) + ")")
        .call(
          d3.svg.axis().scale(this._xScale)
            .tickFormat(this._yScale.tickFormat())
            .tickValues([1, 2, 3, 4, 5, 10, 25, 50, 100, 250, 500, 1000])
            .orient("center")
        ).append("text")
        .attr("class", "label")
        .attr("x", this._width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Budget total (£m)");

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
        .text("Forecast over/under spend(%)");

  },

  _onDepartmentSelectionChange: function(added, removed, selected) {
    var projects = this._validProjects(_.flatten(_.map(selected, function(d) {
      return d.children();
    })));

    var dots = this._pointsContainer.selectAll(".dot")
      .data(projects);

    dots.enter().append("circle")
      .attr("class", "dot")
      .attr("r", 7)
      .attr("cx", _.compose(this._xScale, this._xValue))
      .attr("cy", _.compose(this._yScale, this._yValue))
      .style("fill", function(d) { return colors[d.rating()] })
      .on("click", bindListener(this, function(d) {
        this._vis.setProjectSelection(d);
      }));

    dots.exit().remove();
  },

  _onProjectSelectionChange: function(selection) {
    var highlight = this._pointsContainer.selectAll(".projectSelection")
      .data(_.compact([selection]), function(d) { return d.id });

    highlight.enter().append("circle").call(this._pointHighlight("projectSelection", 6));
    highlight.exit().remove();
  },

  _onDepartmentHighlightChange: function(department) {
    var projects = this._validProjects(department ? department.children() : []);
    var highlight = this._pointsContainer.selectAll(".highlight")
      .data(projects, function(d) { return d.id });

    //selection
    //FIXME only highlight selected depts
    highlight.enter().append("circle").call(this._pointHighlight("highlight", 3));
    highlight.exit().remove();
  },

  _validProjects: function(projects) {
    return _.filter(projects, bindListener(this, function(d)  {
        return this._xValue(d) && this._yValue(d) ;
    }));
  },

  _pointHighlight: function(className, width) {
    return bindListener(this, function(v) {
      v.attr("class", className)
      .attr("r", 14)
      .attr("cx", _.compose(this._xScale, this._xValue))
      .attr("cy", _.compose(this._yScale, this._yValue))
      .style("stroke", "#333")
      .style("stroke-width", width + "px")
      .style("fill", "none");
    });
  },

  _xValue: function(d) { return d.cash_budget();  },
  _yValue: function(d) { return d.percent_variance(); }
}
