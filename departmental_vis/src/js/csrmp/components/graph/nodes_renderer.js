var bindListener = require("../../util/bind_listener");
var d3 = require("d3-browserify");
var _  = require("underscore");

var NodesRenderer = module.exports = function(graph) {
  this._textColour = "#ddd";
  this._defaultColour = "#666";
  this._ratingColourMap = {
    "Green": "#2bab2b",
    "Amber/Green": "url(\"#amberGreenHatch\")",
    "Amber": "#e5ba39",
    "Amber/Red": "url(\"#amberRedHatch\")",
    "Red": "#e54545"
  };
  this._minSize = 40;
  this._maxSize = 120;

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
  var defs = this._graph.svg.append('defs');
  var pattern = defs.append('pattern')
    .attr('id', 'amberGreenHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4);
  pattern.append('rect')
    .attr('fill', this._ratingColourMap.Green)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("x", 0)
    .attr("y", 0);
  pattern.append('path')
    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
    .attr('stroke', this._ratingColourMap.Amber)
    .attr('stroke-width', 1.25);

  var pattern = defs.append('pattern')
    .attr('id', 'amberRedHatch')
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('width', 4)
    .attr('height', 4);
  pattern.append('rect')
    .attr('fill', this._ratingColourMap.Red)
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("x", 0)
    .attr("y", 0);
  pattern.append('path')
    .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
    .attr('stroke', this._ratingColourMap.Amber)
    .attr('stroke-width', 1.25);
};
