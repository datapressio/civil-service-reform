var bindListener = require("../util/bind_listener");
var _ = require("underscore");
var slick = require("slick");
var dom = require("ampersand-dom");

var ProjectsList = module.exports = function(vis) {
  this._vis = vis;
  this._vis.registerProjectSelectionCallback(bindListener(this, this._onProjectSelectionChange));
};

ProjectsList.prototype = {
  _onProjectSelectionChange: function(projects) {
    dom.html(this._element, "");
    _.each(projects, bindListener(this, function(project) {
      var child = document.createElement("li");
      dom.html(child, project.label());
      this._element.appendChild(child);
    }));
  },

  render: function(selector) {
    var container = slick.find(selector);
    this._element = document.createElement("ul");
    dom.addClass(this._element, "projects_list");
    container.appendChild(this._element);
  },
};
