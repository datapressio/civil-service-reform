var Project = module.exports = function(name, details, id, department) {
  this._name = name;
  this._details = details;
  this.id = id;
  this.department = department;
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

Project.prototype.total_life_budget = function() {
  return this._details["total_lifebudget"];
}

Project.prototype.description = function() {
  return this._details["description"];
}

Project.prototype.department_commentary = function() {
  return this._details["department_commentary"];
}

Project.prototype.budget_variance_narrative = function() {
  return this._details["department_narrative_on_budget_variance"];
}

Project.prototype.budget_life_narrative = function() {
  return this._details["department_narrative_on_budget_life"];
}

Project.prototype.schedule_narrative = function() {
  return this._details["department_narrative_on_schedule"];
}

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
