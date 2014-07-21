var mustache = require("mustache");
window.mustache = mustache;
var slick = require("slick");
module.exports = function(template, selector, data, append) {
  if(!data) data = {};
  var element  = slick.find(selector);
  var rendered = mustache.render(template, data);
  var content = append ? element.innerHTML + rendered : rendered;
  element.innerHTML = content;
  return element;
}
