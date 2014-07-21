var DashboardLayout = module.exports = function(scatterplot, hoverBox, departmentsMultiSelect) {
  this._scatterplot = scatterplot;
  this._hoverBox = hoverBox;
  this._departmentsMultiSelect = departmentsMultiSelect;
}

DashboardLayout.prototype = {
  render: function(selector) {
    this._departmentsMultiSelect.render(selector);
    this._hoverBox.render(selector);
    this._scatterplot.render(selector);
  }
}
