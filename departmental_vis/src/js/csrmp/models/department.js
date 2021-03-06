var _ = require("underscore");

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

Department.prototype.projects = function() {
  return _.flatten(_.map(this.children(), function(c) { return c.projects() }));
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

Department.prototype.parent_budget_proportion = function() {
  if(this.parent) {
    return this.cash_budget() / this.parent.cash_budget();
  } else {
    return 1
  }
}

Department.prototype.rating = function() {
 var rating =  _.max([
        ["Green", this.green_count()],
        ["Amber/Green", this.amber_green_count()],
        ["Amber", this.amber_count()],
        ["Amber/Red", this.amber_red_count()],
        ["Red", this.red_count()]
     ], function(p) { return p[1] });
 if(rating[1]) return rating[0];
}

Department.prototype.green_projects = function() {
  return _.filter(this.projects(), function(c) {
    return c.rating() == "Green";
  });
}

Department.prototype.amber_green_projects = function() {
  return _.filter(this.projects(), function(c) {
    return c.rating() == "Amber/Green";
  });
}

Department.prototype.amber_projects = function() {
  return _.filter(this.projects(), function(c) {
    return c.rating() == "Amber";
  });
}

Department.prototype.amber_red_projects = function() {
  return _.filter(this.projects(), function(c) {
    return c.rating() == "Amber/Red";
  });
}

Department.prototype.red_projects = function() {
  return _.filter(this.projects(), function(c) {
    return c.rating() == "Red";
  });
}

//node methods
//
Department.prototype.label = function() {
  return this._name;
};

Department.prototype.key = function() {
  return this.id;
};

Department.prototype.children = function() {
  return this._children;
};

Department.prototype.scale = function() {
  return this.cash_budget();
};
