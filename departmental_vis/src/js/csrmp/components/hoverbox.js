var d3 = require("d3-browserify");
var slick = require("slick");
var _ = require("underscore");
var style = require("dom-style");
var events = require("dom-events");
var fs = require("fs");
var colors = require("../util/colors")
var bindListener = require("../util/bind_listener")
var render = require("../util/render")

var Hoverbox = module.exports = function(vis) {
  this._vis = vis;
  this._vis.registerHighlightCallback(bindListener(this, this._onHighlightChange))
}

Hoverbox.prototype = {

  _template: fs.readFileSync(__dirname + "/../../../templates/hoverbox.mustache", "utf8"),

  render : function(selector) {
    d3.select(selector).append("div").attr("class", "hover");
    this._element = slick.find(".hover");
    style(this._element, "display", "none");
var events = require("dom-events");
    events.on(window, "mousemove", bindListener(this, function(event) {
      style(this._element, "left", (event.clientX + 10) + "px");
      style(this._element, "top", (event.clientY + 10) + "px");
    }));
  },

  _onHighlightChange: function(selected) {
    if(selected)  {
      style(this._element, "display", "block");
      render(this._template, ".hover", {
        name: selected.label(),
        budget: "£" + selected.cash_budget() + "m",
        spend: "£" + selected.cash_forecast() + "m",
        variance: Math.abs(selected.percent_variance()).toFixed(1) + "%",
        variance_direction: selected.percent_variance() > 0 ? "over" : "under",
        total_life_budget: "£" + selected.total_life_budget() + "m",
        rating_class:  selected.rating() ? selected.rating().replace(new RegExp("\\s*\\/\\s*"), "_").toLowerCase() : null,
        department_commentary: selected.department_commentary(),
        department_name: selected.department.label(),
      });
    } else {
      style(this._element, "display", "none");
    }
  }
}

