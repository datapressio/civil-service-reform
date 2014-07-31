var bindListener = require("../util/bind_listener")
var breakLines = require("../util/break_lines")
var render = require("../util/render")
var slick = require("slick");
var events = require("dom-events");
var _ = require("underscore");
var dom = require("ampersand-dom");
var fs = require("fs");

var ProjectOverview = module.exports = function(vis) {
  this._vis = vis;
  this._vis.registerProjectSelectionCallback(bindListener(this, bindListener(this, this._onHighlightChange)));
}

ProjectOverview.prototype = {
  _template: fs.readFileSync(__dirname + "/../../../templates/project_overview.mustache", "utf8"),

  render : function(selector) {
    this._selector = selector;
  },
//FIXME pull out rating_class to dedupe
  _onHighlightChange: function(selected) {
    if(selected)  {
      this._element = render(this._template, this._selector, {
        name: selected.label(),
        budget: "£" + selected.cash_budget() + "m",
        spend: "£" + selected.cash_forecast() + "m",
        variance: Math.abs(selected.percent_variance()).toFixed(1) + "%",
        variance_direction: selected.percent_variance() > 0 ? "over" : "under",
        total_life_budget: "£" + selected.total_life_budget() + "m",
        rating_class:  selected.rating() ? selected.rating().replace(new RegExp("\\s*\\/\\s*"), "_").toLowerCase() : null,
        description: breakLines(selected.description()),
        budget_variance_narrative: breakLines(selected.budget_variance_narrative()),
        budget_life_narrative: breakLines(selected.budget_life_narrative()),
        schedule_narrative: breakLines(selected.schedule_narrative()),
        department_commentary: breakLines(selected.department_commentary()),
        department_name: selected.department.label(),
      });
      this._setupTabs();
    } else {
      slick.find(this._selector).innerHTML = "";
    }
  },

  _setupTabs: function() {
    var tabs = slick.search(".tabs li", this._element);
    var panes = slick.search(".tab_contents li", this._element);
    _.each(_.zip(tabs, panes), function(pair) {
      var tab = pair[0];
      var pane = pair[1];
      events.on(tab, "click", function() {
         _.each(tabs, function(t) { dom.removeClass(t, "selected") });
         _.each(panes, function(p) { dom.removeClass(p, "selected")});
         dom.addClass(tab, "selected");
         dom.addClass(pane, "selected");
      });
    });
    dom.addClass(tabs[0], "selected");
    dom.addClass(panes[0], "selected");
  },

  clickTab: function(event) {
    event.preventDefault();
  }
}
