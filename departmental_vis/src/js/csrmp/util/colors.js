var _  = require("underscore");
var defaultPallete = "solid";
var colors = module.exports =  {
  hatched: {
    "Green": "#2bab2b",
    "Amber/Green": "url(\"#amberGreenHatch\")",
    "Amber": "#e5ba39",
    "Amber/Red": "url(\"#amberRedHatch\")",
    "Red": "#e54545"
  },

  solid: {
    "Green": "#2bab2b",
    "Amber/Green": "#91b32d",
    "Amber": "#e5ba39",
    "Amber/Red": "#d95f36",
    "Red": "#e54545"
  }
}
_.extend(colors, colors[defaultPallete]);
