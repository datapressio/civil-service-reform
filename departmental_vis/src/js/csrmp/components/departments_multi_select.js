var render = require("../util/render")
var fs = require("fs");
var _ = require("underscore");
var bindListener = require("../util/bind_listener");
var dom = require("ampersand-dom");
var slick = require("slick");
var events = require("dom-events");


var DepartmentsMultiSelect = module.exports = function(vis, departments) {
  this._vis = vis;
  this._departments = departments;
  this._vis.registerDepartmentSelectionCallback(bindListener(this, this._onSelectionChange));
  this._vis.registerProjectSelectionCallback(bindListener(this, this._onHighlight));
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


  _onHighlight: function(project) {
    _.each(slick.search("label", this._element), function(element) {
      dom.removeClass(element, "highlighted");
    })
    if(project) {
      var department = project.department;
      var element = slick.find("label[for='"+department.key()+"']", this._element);
      dom.addClass(element, "highlighted");
    }
  },

  render : function(selector) {
    this._element = render(this._template, selector, this._templateParams(), true);
    var checkboxes = slick.search("input", this._element);
    var labels = slick.search("label", this._element);
    _.each(checkboxes, bindListener(this, function(checkbox) {
      events.on(checkbox, "click", bindListener(this, this._changeSelection));
    }));
    _.each(labels, bindListener(this, function(label) {
      events.on(label, "mouseover", bindListener(this, this._changeHighlight));
      events.on(label, "mouseout", bindListener(this, this._removeHighlight));
    }));
    events.on(slick.find(".select_all", this._element), "click", bindListener(this, this._selectAll));
    events.on(slick.find(".select_none", this._element), "click", bindListener(this, this._selectNone));
  },

  _changeSelection: function(event) {
    var element = event.target;
    var department = _.find(this._departments, function(d) { return d.key() == element.value});
    this._vis.toggleDepartmentSelection(department);
  },

  _changeHighlight: function(event) {
    var element = event.target;
    var department = _.find(this._departments, function(d) { return d.key() == element.getAttribute("for")});
    this._vis.setDepartmentHighlight(department);
  },

  _removeHighlight: function(event) {
    this._vis.setDepartmentHighlight(null);
  },

  _selectAll : function(event) {
    event.preventDefault();
    this._vis.addDepartmentSelections(this._departments)
  },

  _selectNone : function(event) {
    event.preventDefault();
    this._vis.removeDepartmentSelections(this._departments);
  },

  _templateParams: function() {
    return {
      departments: _.map(this._departments, function(dept) {
        return { label : dept.label(), id : dept.key() };
      })
    }
  }
}
