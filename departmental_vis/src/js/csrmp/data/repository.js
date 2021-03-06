var d3  = require("d3-browserify");
var models = require ("../models");
var _ = require("underscore");

var Repository = module.exports = function() {};

Repository.prototype.getDepartmentsGraph = function(callback) {
  d3.json("data/major_projects_departmental_breakdown.json", function(error, response) {
    var csData = response["Civil Service"];
    var n = 0;
    var m = 0;
    var departments = _.sortBy(_.map(csData.departments, function(departmentData, departmentName) {
      var projects = _.sortBy(_.map(departmentData.projects, function(projectData, projectName) {
        p =  new models.Project(projectName, projectData, "project-"+m);
        m++;
        return p;
      }), function(p) {
        return - p.cash_budget();
      });
      d = new models.Department(departmentName, departmentData.summary, projects, "department-" + n);
      _.each(projects, function(p) { p.department = d });//FIXME
      n++;
      return d;
    }), function(d) {
      return - d.cash_budget();
    });
    var cs = new models.Department("Civil Service", csData.summary, departments, "cs");
    _.each(departments, function(d) { d.parent = cs }); //FIXME
    callback(cs);
  });
};

Repository.prototype.getRatingsGraph = function(callback) {
  d3.json("data/major_projects_ratings_breakdown.json", function(error, response) {
    var csData = response["Civil Service"];
    var n = 0;
    var m = 0;
    var ratings = _.map(csData.ratings, function(ratingData, ratingName) {
      var projects = _.map(ratingData.projects, function(projectData, projectName) {
        p =  new models.Project(projectName, projectData, "project-"+m);
        m++;
        return p;
      });
      d = new models.Rating(ratingName, ratingData.summary, projects, "rating-" + n);
      n++;
      return d;
    });
    var cs = new models.Rating("Civil Service", csData.summary, ratings, "cs");
    callback(cs);
  });
};

Repository.prototype.getProjects = function(callback) {
  d3.json("data/major_projects_departmental_breakdown.json", function(error, response) {
    var csData = response["Civil Service"];
    var n = 0;
    var m = 0;
    var projects = _.flatten(_.map(csData.departments, function(departmentData, departmentName) {
        var d = new models.Department(departmentName, departmentData.summary, [], "department-" + n);
      var ps =  _.map(departmentData.projects, function(projectData, projectName) {
        var p =  new models.Project(projectName, projectData, "project-"+m, d);
        m++;
        return p;
      });
      n++;
      return ps;
    }));
    callback(projects);
  });
}
