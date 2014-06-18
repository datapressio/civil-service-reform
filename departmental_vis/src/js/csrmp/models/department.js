var Department = module.exports = function(name, details, children, id) {
  this._name = name;
  this._details = details;
  this._children = children;
  this.id = id
};

Department.prototype.cash_budget = function() {
  return this._details["2013_cash_budget"];
};

//node methods
//
Department.prototype.label = function() {
  return this._name;
};

Department.prototype.children = function() {
  return this._children;
};

Department.prototype.scale = function() {
  return this.cash_budget();
};
