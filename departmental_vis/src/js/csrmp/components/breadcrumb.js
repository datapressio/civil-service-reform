var slick = require("slick");
var dom = require("ampersand-dom");
var bindListener = require("../util/bind_listener");
var events = require("dom-events");

var Breadcrumb = module.exports = function(report, root) {
  this._report = report;
  this._root = root;
  this._report.registerSelectionChangeCallback(bindListener(this, this._onChangeSelection));
}

Breadcrumb.prototype = {
  render: function(selector) {
    this._element = slick.find(selector);
    this._rootElement = this._createLinkElement(this._root);
    this._element.appendChild(this._rootElement);

  },

  _onChangeSelection: function(dept) {
    dom.html(this._element, "");
    this._element.appendChild(this._rootElement);
    if(dept != this._root)  {
      this._element.appendChild(document.createTextNode(" \u00BB " + dept.label()));
    }
  },

  _createLinkElement: function(department) {
    var element = document.createElement("a");
    dom.html(element, department.label());
    events.on(element, "click", bindListener(this, this._clickListener(department)));
    return element;
  },

  _clickListener: function(department) {
    return bindListener(this, function(event) {
      event.preventDefault();
      this._report.setSelection(department);
    });
  }

}
