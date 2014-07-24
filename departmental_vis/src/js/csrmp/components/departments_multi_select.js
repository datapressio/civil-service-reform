var render = require("../util/render")
var fs = require("fs");
var _ = require("underscore");
var events = require("dom-events");
var bindListener = require("../util/bind_listener");
var dom = require("ampersand-dom");
var slick = require("slick");
var events = require("dom-events");


var DepartmentsMultiSelect = module.exports = function(vis, departments) {
  this._vis = vis;
  this._departments = departments;
  this._vis.registerMultiSelectionCallback(bindListener(this, this._onSelectionChange));
}

DepartmentsMultiSelect.prototype = {

  _template: fs.readFileSync(__dirname + "/../../../templates/departments_multi_select.mustache", "utf8"),

  _onSelectionChange : function(added, removed) {
   _.each(added, function(dept) {
      var checkbox = document.getElementById(dept.key());
      checkbox.checked = true;
   });
    _.each(removed, function(dept) {
      var checkbox = document.getElementById(dept.key());
      checkbox.checked = false;
    });
  },

  render : function(selector) {
    this._element = render(this._template, selector, this._templateParams(), true);
    var checkboxes = slick.search("input", this._element);
    _.each(checkboxes, bindListener(this, function(checkbox) {
      events.on(checkbox, "click", bindListener(this, this._changeSelection));
    }));
    events.on(slick.find(".select_all", this._element), "click", bindListener(this, this._selectAll));
    events.on(slick.find(".select_none", this._element), "click", bindListener(this, this._selectNone));
  },

  _changeSelection: function(event) {
    var element = event.target;
    var department = _.find(this._departments, function(d) { return d.key() == element.value});
    this._vis.toggleSelection(department);
  },

  _selectAll : function(event) {
    event.preventDefault();
    this._vis.addSelections(this._departments)
  },

  _selectNone : function(event) {
    event.preventDefault();
    this._vis.removeSelections(this._departments);
  },

  _templateParams: function() {
    return {
      departments: _.map(this._departments, function(dept) {
        return { label : dept.label(), id : dept.key() };
      })
    }
  }
}
