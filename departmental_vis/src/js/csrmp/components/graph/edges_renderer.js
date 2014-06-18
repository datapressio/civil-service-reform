var _  = require("underscore");

var EdgesRenderer = module.exports = function(graph) {
  this._colour = "#dddddd";
  this._width = "2px";
  this._graph = graph;
};

EdgesRenderer.prototype.render = function(edges) {
  var elements = this._graph.svg.select(".edges").selectAll(".edge");
  var data = elements.data(edges, function(d) { return d.key(); });

  data.exit().remove();

  data.enter().append("line")
    .attr("class", "edge")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; })
    .style("stroke", this._colour)
    .style("stroke-width", this._width);
};

EdgesRenderer.prototype.tick = function() {
  var elements = this._graph.svg.selectAll(".edge");
  elements.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });
};
