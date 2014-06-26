var mustache = require("mustache");
window.mustache = mustache;
var slick = require("slick");
module.exports = function(template, selector, data) {
  if(!data) data = {};
  var element  = slick.find(selector);
  element.innerHTML = mustache.render(template, data);
  return element;
}
