var Styles;

// this is a wrapped function
(function ()
{
  // the variables declared here will not be scoped anywhere and will only be accessible in this wrapped function
  var defaultColor = "white",
  highlightColor = "#FEFFD5";

  Styles = {
    navitem: {
      base: {
        font: '30pt',
        align: 'left',
        strokeThickness: 4
      },
      default: {
        fill: defaultColor,
        stroke: 'rgba(0,0,0,0)'
      },
      inverse: {
        fill: 'black',
        stroke: 'black'
      },
      hover: {
        fill: highlightColor,
        stroke: 'rgba(200,200,200,0.5)'
      }
    }
  };

  for (var key in Styles.navitem)
  {
    if (key !== "base")
    {
      Object.assign(Styles.navitem[key], Styles.navitem.base)
    }
  }
})();
// the trailing () triggers the function call immediately