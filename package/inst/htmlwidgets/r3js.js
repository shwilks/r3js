HTMLWidgets.widget({

  name: 'r3js',

  type: 'output',

  factory: function(el, width, height) {

    r3jsviewer = new R3JS.Viewer(el);

    return {

      renderValue: function(x) {

        // TODO: code to render the widget, e.g.
        r3jsviewer.load(x.data3js);

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
