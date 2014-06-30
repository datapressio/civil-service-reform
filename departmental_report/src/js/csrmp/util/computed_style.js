module.exports = function(element, key) {
  var styles;
  if(window.getComputedStyle) {
    styles = window.getComputedStyle(element);
  } else {
    styles = element.currentStyle;
  }
  var style = styles[key];
  var digitMatch = style.match(/([0-9]+)px/);
  if(digitMatch) {
    style = parseInt(digitMatch[1]);
  }
  return style;
}
