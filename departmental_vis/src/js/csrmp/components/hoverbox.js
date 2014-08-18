var d3 = require("d3-browserify");
var slick = require("slick");
var style = require("dom-style");
var events = require("dom-events");
var bindListener = require("../util/bind_listener")

var Hoverbox = module.exports = function(vis, contentComponent) {
  this._vis = vis;
  this._contentComponent = contentComponent;
  //TODO generalise observer mechanism make all message names configurable and passed in.
  this._vis.registerProjectSelectionCallback(bindListener(this, bindListener(this, this._onHighlightChange)));
}

Hoverbox.prototype = {
  render : function(selector) {
    d3.select(selector).append("div").attr("class", "hover");
    this._element = slick.find(".hover");
    this._contentComponent.render(selector + " .hover");
    style(this._element, "display", "none");
    events.on(window, "mousemove", bindListener(this, function(event) {
      style(this._element, "left", (event.clientX + 10) + "px");
      style(this._element, "top", (event.clientY + 10) + "px");
    }));
  },

  _onHighlightChange: function(selected) {
    if(selected) {
      style(this._element, "display", "block");
    } else {
      style(this._element, "display", "none");
    }
  }
}

