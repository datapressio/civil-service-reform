var domready = require("domready");
var csrmp = require("./csrmp");
domready(function() {
  var report = new csrmp.Report("csr-mp-report");
  report.init();
})
