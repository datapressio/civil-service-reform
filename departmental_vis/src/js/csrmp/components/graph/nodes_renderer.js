var bindListener = require("../../util/bind_listener");
var d3 = require("d3-browserify");
var _  = require("underscore");
var colors = require("../../util/colors");
var Patterns = require("../Patterns")

var NodesRenderer = module.exports = function(graph) {
  this._textColour = "#ddd";
  this._defaultColour = "#666";
  this._ratingColourMap = colors
  this._minSize = 40;
  this._maxSize = 150;

  this._graph = graph;
  var sizes = _.map (this._graph.allNodes, function(n) { return n.scale(); });
  this.radiusScale = d3.scale.sqrt()
    .range([this._minSize, this._maxSize])
    .domain([_.min(sizes), _.max(sizes)]);
  this._setupPatterns();
};

NodesRenderer.prototype.render = function(nodes) {
  var elements = this._graph.svg.select(".nodes").selectAll(".node");
  var data = elements.data(nodes, function(d) { return d.key() });

  data.exit().remove();

  var container = data.enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d){
      var x  = d.x || 0;
      var y = d.y || 0;
      return "translate("+x+","+y+")"; })
    .call(this._graph.layout.drag)
    .on("click", bindListener(this, this._click));

  container.append("circle")
    .attr("r", bindListener(this, function(d)  {
      return this.radiusScale(d.scale());
    }))
  .style("fill", bindListener(this, function(d) {
    rating = d.rating();
    return this._colour(rating);
  }));

  container.append("text")
    .text(function(d) { return d.label(); })
    .attr("fill", this._textColour)
    .attr("text-anchor", "middle");

};

NodesRenderer.prototype._colour = function(rating) {
  return this._ratingColourMap[rating] || this._defaultColour;
};

NodesRenderer.prototype._click = function(node) {
  this._graph.selectNode(node);
};

NodesRenderer.prototype.tick = function() {
  var elements = this._graph.svg.selectAll(".node");
  elements.attr("transform", function(d){
        var x  = d.x  || 0;
        var y =  d.y  || 0;
        return "translate("+x+","+y+")"; });
};

NodesRenderer.prototype._setupPatterns = function() {
  var p = new Patterns();
  p.render();
};


