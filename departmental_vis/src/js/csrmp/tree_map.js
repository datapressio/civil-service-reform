var d3 = require("d3-browserify");
var slick = require("slick");
var _ = require("underscore");
var events = require("dom-events");
var style = require("dom-style");
var fs = require("fs");
var mustache = require("mustache");
var colors = {
  "Green": "#2bab2b",
  "Amber/Green": "url(\"#amberGreenHatch\")",
  "Amber": "#e5ba39",
  "Amber/Red": "url(\"#amberRedHatch\")",
  "Red": "#e54545"
}

var hoverTemplate = fs.readFileSync(__dirname + "/../../templates/hoverbox.mustache", "utf8");

var Treemap = module.exports = function(selector) {
  this._selector = selector;
}


Treemap.prototype.render = function() {

  function setupHover(selector) {
    d3.select(selector).append("div").attr("class", "hover");
    var hoverbox = slick.find(".hover");
    style(hoverbox, "display", "none");
    events.on(window, "mousemove", function(event) {
      style(hoverbox, "left", (event.clientX + 10) + "px");
      style(hoverbox, "top", (event.clientY + 10) + "px");
    });
    _.each(slick.search(".depth rect"), function(child) {
      events.on(child, "mouseover", function(event) {
        var id = child.id.match(/datum\-([0-9]+)/)[1]
        var datum = window.data[id];
        style(hoverbox, "display", "block");
        hoverbox.innerHTML = mustache.render(hoverTemplate, {
          name: datum.name,
          budget: "£" + datum["2013_cash_budget"] + "m",
          spend: "£" + datum["2013_cash_forecast"] + "m",
          variance: Math.abs(datum["2013_percent_variance"]).toFixed(1) + "%",
          variance_direction: datum["2013_percent_variance"] > 0 ? "over" : "under"
        });
      });
      events.on(child, "mouseout", function(event) {
        style(hoverbox, "display", "none");
      });
    });
  }


  function setupPatterns(selector) {
    var svg = d3.select(selector).append("svg");
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
  };

  var margin = {top: 20, right: 0, bottom: 0, left: 0},
      width = 960,
      height = 500 - margin.top - margin.bottom,
      formatNumber = d3.format(",d"),
      transitioning;

  var x = d3.scale.linear()
      .domain([0, width])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([0, height])
      .range([0, height]);

  var treemap = d3.layout.treemap()
      .children(function(d, depth) { return depth ? null : d._children; })
      .sort(function(a, b) { return a.value - b.value; })
      .ratio(height / width * 0.5 * (1 + Math.sqrt(5)))
      .round(false);

  var svg = d3.select(this._selector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.bottom + margin.top)
      .style("margin-left", -margin.left + "px")
      .style("margin.right", -margin.right + "px")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("shape-rendering", "crispEdges");

  var grandparent = svg.append("g")
      .attr("class", "grandparent");

  grandparent.append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", margin.top);

  grandparent.append("text")
      .attr("x", 6)
      .attr("y", 6 - margin.top)
      .attr("dy", ".75em");

  setupPatterns(this._selector);
  selector = this._selector;
  d3.json("data/major_projects_departmental_breakdown.json", function(response) {
    window.data = [];
    root = response["Civil Service"];
    root.name = "Civil Service";
    initialize(root);
    accumulate(root);
    layout(root);
    display(root);
    setupHover(selector);

    function initialize(root) {
      root.x = root.y = 0;
      root.dx = width;
      root.dy = height;
      root.depth = 0;
    }

    // Aggregate the values for internal nodes. This is normally done by the
    // treemap layout, but not here because of our custom implementation.
    // We also take a snapshot of the original children (_children) to avoid
    // the children being overwritten when when layout is computed.
    function accumulate(d) {
      d.id = window.data.length;
      window.data.push(d);
      d._children = children(d);
      for(child in d._children) {
        accumulate(d._children[child]);
      }
      d.value = d.summary ? d.summary["2013_cash_budget"] : d["2013_cash_budget"];
      d.color = colors[d["rating"]];
    }

    function children(d) {
      var children;
      if(d.departments) {
        children = values(d.departments);
      } else if(d.projects) {
        children = values(d.projects);
      } else {
        children = [];
      }
      return children;
    }

    function values(d) {
      var arr = [];
      for(i in d) {
        d[i].name = i;
        arr.push(d[i]);
      }
      return arr;
    }

    // Compute the treemap layout recursively such that each group of siblings
    // uses the same size (1×1) rather than the dimensions of the parent cell.
    // This optimizes the layout for the current zoom state. Note that a wrapper
    // object is created for the parent node for each group of siblings so that
    // the parent’s dimensions are not discarded as we recurse. Since each group
    // of sibling was laid out in 1×1, we must rescale to fit using absolute
    // coordinates. This lets us use a viewport to zoom.
    function layout(d) {
      if (d._children) {
        treemap.nodes({_children: d._children});
        d._children.forEach(function(c) {
          c.x = d.x + c.x * d.dx;
          c.y = d.y + c.y * d.dy;
          c.dx *= d.dx;
          c.dy *= d.dy;
          c.parent = d;
          layout(c);
        });
      }
    }

    function display(d) {
      grandparent
          .datum(d.parent)
          .on("click", transition)
        .select("text")
          .text(name(d));

      var g1 = svg.insert("g", ".grandparent")
          .datum(d)
          .attr("class", "depth");

      var g = g1.selectAll("g")
          .data(d._children)
        .enter().append("g");

      g.filter(function(d) { return d._children; })
          .classed("children", true)
          .on("click", transition);

      g.selectAll(".child")
          .data(function(d) { return d._children || [d]; })
        .enter().append("rect")
          .attr("class", "child")
          .call(rect);

      g.append("rect")
          .attr("class", "parent")
          .style("fill", function(d) { return d.color; })
          .call(rect)
        .append("title")
          .text(function(d) { return formatNumber(d.value); });

      g.append("text")
          .attr("dy", ".75em")
          .attr("class", "label")
          .text(function(d) { return d.name; })
          .call(text);

      function transition(d) {
        if (transitioning || !d) return;
        transitioning = true;

        var g2 = display(d),
            t1 = g1.transition().duration(750),
            t2 = g2.transition().duration(750);

        // Update the domain only after entering new elements.
        x.domain([d.x, d.x + d.dx]);
        y.domain([d.y, d.y + d.dy]);

        // Enable anti-aliasing during the transition.
        svg.style("shape-rendering", null);

        // Draw child nodes on top of parent nodes.
        svg.selectAll(".depth").sort(function(a, b) { return a.depth - b.depth; });

        // Fade-in entering text.
        g2.selectAll("text").style("fill-opacity", 0);

        // Transition to the new view.
        t1.selectAll("text").call(text).style("fill-opacity", 0);
        t2.selectAll("text").call(text).style("fill-opacity", 1);
        t1.selectAll("rect").call(rect);
        t2.selectAll("rect").call(rect);

        // Remove the old node when the transition is finished.
        t1.remove().each("end", function() {
          svg.style("shape-rendering", "crispEdges");
          transitioning = false;
        });
      }

      return g;
    }

    function text(text) {
      text.attr("x", function(d) { return x(d.x) + 6; })
          .attr("y", function(d) { return y(d.y) + 6; });
    }

    function rect(rect) {
      rect.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", function(d) { return x(d.x + d.dx) - x(d.x); })
          .attr("height", function(d) { return y(d.y + d.dy) - y(d.y); })
          .style("fill", function(d) { return d.color; })
          .attr("id", function(d) { return "datum-" + d.id; });
    }

    function name(d) {
      return d.parent
        ? name(d.parent) + " > " + d.name
          : d.name;
    }
  });
}
