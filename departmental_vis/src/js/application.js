var domready = require("domready");
var csrmp = require("./csrmp");
var slick = require("slick");

domready(function() {
  if(slick.find("#csr-mp-report")) {
    var report = new csrmp.Report("csr-mp-report");
    report.init();
  }

  if(slick.find("#csr-mp-vis")) {
    var vis = new csrmp.Visualisation("#csr-mp-vis");
    vis.render();
  }

  if(slick.find("#csr-mp-treemap")) {
    var vis = new csrmp.Treemap("#csr-mp-treemap");
    vis.render();
  }
})
