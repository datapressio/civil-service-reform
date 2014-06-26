var d3  = require("d3-browserify");
var models = require ("../models");
var _ = require("underscore");

var Repository = module.exports = function() {};

Repository.prototype.getGraph = function(callback) {
  d3.json("data/major_projects_departmental_breakdown.json", function(error, response) {
    var csData = response["Civil Service"];
    var n = 0;
    var m = 0;
    var departments = _.map(csData.departments, function(departmentData, departmentName) {
      var projects = _.map(departmentData.projects, function(projectData, projectName) {
        p =  new models.Project(projectName, projectData, "project-"+m);
        m++;
        return p;
      });
      d = new models.Department(departmentName, departmentData.summary, projects, "department-" + n);
      n++;
      return d;
    });
    var cs = new models.Department("Civil Service", csData.summary, departments, "cs");
    callback(new models.Tree(cs));
  });
};

