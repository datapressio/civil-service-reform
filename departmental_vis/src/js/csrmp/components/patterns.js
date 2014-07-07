var d3 = require("d3-browserify");
var colors = require("../util/colors");
var Patterns = module.exports = function() {}

Patterns.prototype = {
  render: function() {
    var svg = d3.select(document.body).append("svg");
    var defs = svg.append('defs');
    var pattern = defs.append('pattern')
      .attr('id', 'amberGreenHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4);
    pattern.append('rect')
      .attr('fill', colors.Green)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "fill")
      .attr("x", 0)
      .attr("y", 0);
    pattern.append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', colors.Amber)
      .attr('stroke-width', 1.25);

    var pattern = defs.append('pattern')
      .attr('id', 'amberRedHatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4);
    pattern.append('rect')
      .attr('fill', colors.Red)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "fill")
      .attr("x", 0)
      .attr("y", 0);
    pattern.append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('stroke', colors.Amber)
      .attr('stroke-width', 1.25);
  }
}
