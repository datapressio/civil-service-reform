var d3 = require("d3-browserify");
var bindListener = require("../util/bind_listener");
var GraphNodes = require("./graph/nodes_renderer");
var GraphEdges = require("./graph/edges_renderer");
var _ = require("underscore");
var Graph = module.exports = function(root, svg) {

  this._width = 1000;
  this._height = 1000;
  this._rootX = this._width/2;
  this._rootY = this._height/2;
  this.upstreamX = 100;
  this.upstreamY = 100;
  this._charge = -10000;
  this._friction = 0.1;
  this._gravity = 0.9;
  this._linkDistance = 600;
  this._distanceNoiseCoefficient = 0.25;


  this._nodes = [];
  this._edges = [];
  this._upstreamNodes = [];
  this._upstreamEdges = [];
  this.root = root;
  this._selectedNode = root;
  this.allNodes = this.root.descendentNodes();
  this.svg = svg.append("g").attr("class", "viewport");
  this.svg.append("g").attr("class", "edges")
  this.svg.append("g").attr("class", "nodes")
  this.layout = d3.layout.force();
  this._nodeRenderer = new GraphNodes(this);
  this._edgeRenderer = new GraphEdges(this);
};

Graph.prototype.render = function() {
  this._setupLayout();
  this.selectNode(this.root);
};

Graph.prototype._setupLayout = function() {
  this.layout.size([this._width, this._height])
  .nodes(this._nodes)
  .links(this._edges)
  .charge(this._charge)
  .friction(this._friction)
  .gravity(this._gravity)
  .linkDistance(bindListener(this, function(d) { return this._linkDistance * (1-Math.random()*this._distanceNoiseCoefficient)}))
  .on("tick", bindListener(this, this._tick)).start();
};

Graph.prototype._tick = function() {
  this._edgeRenderer.tick();
  this._nodeRenderer.tick();
  this._selectedNode.x = this._rootX;
  this._selectedNode.y = this._rootY;
  if(this._upstreamNodes[0]) {
    this._upstreamNodes[0].x = this.upstreamX;
    this._upstreamNodes[0].y = this.upstreamY;
  }
};

Graph.prototype.selectNode = function(node) {

  var update = function(target, source) {
    var existing = _.filter(target, function(x) {
      return _.contains(_.map(source, function(y) { return y.key()}), x.key());
    });
    var exits = _.difference(target, existing);
    var enters = _.filter(source, function(x) {
      return !_.contains(_.map(existing, function(y) { return y.key()}), x.key());
    });

    _.each(exits, function(d) {
      var i = _.indexOf(target, d);
      target.splice(i, 1);
    });

    target.push.apply(target, enters);
  }

  this._selectedNode = node;
  update(this._upstreamNodes, node.ascendantNodes());
  update(this._upstreamEdges, node.ascendantEdges());
  update(this._nodes, node.neighbourNodes().concat(this._upstreamNodes));
  update(this._edges, node.neighbourEdges().concat(this._upstreamEdges));
  this._edgeRenderer.render(this.layout.links());
  this._nodeRenderer.render(this.layout.nodes());
  this.layout.start();
};

