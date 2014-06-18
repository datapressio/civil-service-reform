var domready = require("domready");
var csrmp = require("./csrmp");
domready(function() {
  var vis = new csrmp.Visualisation("#csr-mp-vis");
  vis.render();
});
