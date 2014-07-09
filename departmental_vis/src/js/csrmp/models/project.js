var Project = module.exports = function(name, details, id) {
  this._name = name;
  this._details = details;
  this.id = id;
};

Project.prototype.cash_budget = function() {
  return this._details["2013_cash_budget"];
};

Project.prototype.percent_variance = function() {
  return this._details["2013_percent_variance"];
};

Project.prototype.cash_forecast = function() {
  return this._details["2013_cash_forecast"];
};
//node methods
//
Project.prototype.label = function() {
  return this._name;
};

Project.prototype.children = function() {
  return [];
};

Project.prototype.scale = function() {
  return this.cash_budget();
};

Project.prototype.rating = function() {
  return this._details.rating;
}
