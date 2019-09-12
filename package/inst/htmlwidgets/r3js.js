HTMLWidgets.widget({

  name: 'r3js',

  type: 'output',

  factory: function(el, width, height) {

    r3jsviewer = new R3JS.Viewer(el);

    return {

      renderValue: function(x) {

        // Code to render the widget
        r3jsviewer.load(x.data3js);

      }

    };
  }
});
