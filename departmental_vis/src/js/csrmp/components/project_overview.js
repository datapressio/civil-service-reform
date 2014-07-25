var bindListener = require("../util/bind_listener")
var render = require("../util/render")
var slick = require("slick");
var fs = require("fs");

var ProjectOverview = module.exports = function(vis) {
  this._vis = vis;
  this._vis.registerHighlightCallback(bindListener(this, bindListener(this, this._onHighlightChange)));
}

ProjectOverview.prototype = {
  _template: fs.readFileSync(__dirname + "/../../../templates/project_overview.mustache", "utf8"),

  render : function(selector) {
    this._selector = selector;
  },

  _onHighlightChange: function(selected) {
    if(selected)  {
      render(this._template, this._selector, {
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
      slick.find(this._selector).innerHTML = "";
    }
  }
}
