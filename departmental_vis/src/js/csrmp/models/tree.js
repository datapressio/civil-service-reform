var _ = require("underscore");
var bindListener = require("../util/bind_listener");

var Tree = module.exports = function(root, inboundEdge) {
  this._root = root;
  this._inboundEdge = inboundEdge;
};

Tree.prototype.neighbourNodes = function() {
  return _.compact([this.parent(), this].concat(this.children()));
};

Tree.prototype.neighbourEdges = function() {
  return _.compact([this.inboundEdge()].concat(this.outboundEdges()));
};

Tree.prototype.outboundEdges = function() {
  if(!this._outboundEdges) this._memoizeNeighbours();
  return this._outboundEdges;
};

Tree.prototype.children = function() {
  if(!this._children) this._memoizeNeighbours();
  return this._children;
};

Tree.prototype.inboundEdge = function() {
  return this._inboundEdge;
};

Tree.prototype.parent = function() {
  if(this.inboundEdge()) return this.inboundEdge().source;
};

var descendentsOf = function(node) {
  children = node.children();
  return children.concat(_.flatten(_.map(children, descendentsOf), true));
};

Tree.prototype.descendentNodes = function() {
  return [this].concat(descendentsOf(this));
};

Tree.prototype.descendentEdges = function() {
  return _.flatten(_.map(this.descendentNodes(), function(node) {
    return node.outboundEdges();
  }), true);
};

Tree.prototype.scale = function() {
  return this._root.scale();
};

Tree.prototype.label = function() {
  return this._root.label();
};

Tree.prototype.rating = function() {
  if(this._root.rating) return this._root.rating();
}

Tree.prototype.key = function() {
  return this._root.id.toString();
}

Tree.prototype._memoizeNeighbours = function() {
  var results = _.zip.apply(_, _.map(this._root.children(), bindListener(this, function(child) {
    var edge = new Edge(this, null);
    var node = new Tree(child, edge);
    edge.target = node;
    return [node, edge];
  })));
  this._children = results[0] || []
  this._outboundEdges = results[1] || [];
}
var Edge = function(source, target) {
  this._targetLength = 200;
  this.source = source;
  this.target = target;
};

Edge.prototype.length = function() {
  return this.source.scale() + this.target.scale() + this._targetLength;
};

Edge.prototype.key = function() {
  return this.source.key() + "-" + this.target.key();
}

