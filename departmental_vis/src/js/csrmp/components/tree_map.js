var d3 = require("d3-browserify");
var slick = require("slick");
var bindListener = require("../util/bind_listener");
var colors = require("../util/colors")

var Treemap = module.exports = function(vis) {
  this._vis = vis;
  this._vis.registerSelectionCallback(bindListener(this, this._onSelectionChange));
  this._layout = null;
}

Treemap.prototype = {

  _ratioCoefficient : 1.618,

  render : function(selector) {
    this._element = slick.find(selector);

    width = this._element.offsetWidth;
    height = this._element.offsetHeight;

    this._layout = d3.layout.treemap()
      .children(function(d, depth) { return depth ? null : d.children() })
      .sort(function(a, b) { return a.scale() - b.scale()})
      .ratio(height / width * this._ratioCoefficient)
      .value(function(d) { return d.scale() })
      .round(false);

    this._x = d3.scale.linear()
      .domain([0, 1])
      .range([0, width]);

    this._y = d3.scale.linear()
      .domain([0, 1])
      .range([0, height]);

    this._svg = d3.select(this._element).append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .style("shape-rendering", "crispEdges");
  },

  _onSelectionChange : function(selection) {
    this._svg.innerHTML = "";
    var x = this._x;
    var y = this._y;
    var g = this._svg.datum(selection).selectAll(".node")
       .data(this._layout.nodes(selection))
       .enter().append("g")
       .attr("class", "child")
       .attr("id", function(d) { return d.id })
       .attr("transform", function(d) { return "translate("+x(d.x)+","+y(d.y)+")" })

    g.append("rect")
      .style("fill", function(d) { return colors[d.rating()]; })
      .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
      .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
      .on("click", bindListener(this, function(d) {
        this._vis.setSelection(d);
        this._vis.setHighlight(null);
      }))
      .on("mouseover", bindListener(this, function(d) {
        this._vis.setHighlight(d);
      }))
      .on("mouseout", bindListener(this, function(d) {
        this._vis.setHighlight(null);
      }))

    g.append("text")
      .attr("dy", "1em")
      .attr("class", "label")
      .text(function(d) { return d.label() });
  },
}
