var Department = module.exports = function(name, details, children, id) {
  this._name = name;
  this._details = details;
  this._children = children;
  this.id = id
};

Department.prototype.green_count = function() {
  return this._details["n_green"];
}

Department.prototype.amber_green_count = function() {
  return this._details["n_amber_green"];
}

Department.prototype.amber_count = function() {
  return this._details["n_amber"];
}

Department.prototype.amber_red_count = function() {
  return this._details["n_amber_red"];
}

Department.prototype.red_count = function() {
  return this._details["n_red"];
}

Department.prototype.projects_count = function() {
  return this._details["n"];
};

Department.prototype.over_budget_count = function() {
  return this._details["n_over_budget"];
};

Department.prototype.under_budget_count = function() {
  return this._details["n_under_budget"];
};

Department.prototype.percent_variance = function() {
  return this._details["2013_percent_variance"];
};

Department.prototype.cash_budget = function() {
  return this._details["2013_cash_budget"];
};

Department.prototype.cash_forecast = function() {
  return this._details["2013_cash_forecast"];
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

