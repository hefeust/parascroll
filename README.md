
ParaScroll README
=================

Welcome to ParaScroll README repo !

ParaScroll is a and customizable parallax scroller effect ready top embed in your webpages. It is easily configurable via a JSON theme file.

building from sources
---------------------

if your want to compile the sources with node.js, there's a gulpfile.js at root folder level. Just type in your console :

    npm install && gulp build

setup and run in your page
--------------------------

In the <body> of your webpage:

    <!-- placeholder -->
    <div id="ps" style="height: 50vh;"> </div>
    
    <!-- Jquery is used for easing load event and AJAX theme call -->
    <script src="vendor/jquery-3.2.1.min.js"></script>
    
    <!-- code here -->
    <script src="dist/parascroll.js"></script>
    <script>
      $(document).ready(function() {
        $.getJSON('parascroll/theme.json', function(theme) {
          var container = $('#ps').get(0);
          var ps = new ParaScroll(container, theme);

          ps.run();
        });
      });
    </script>
    
And that's it !

configuration file
------------------

in the "display" section we find dimensions in viewport height and width, and general background color.

In the "layers" section we find an array of layers configurations Each entry looks like the followong :

    {
      "name": "floor-background",
      "velocity": "10",
      "top": "40%",
      "left": "10%",
      "width": "80%",
      "height": "40%",
      "spritesheet": "parascroll/spritesheet.png",
      "distro": [20, 30, 50]
    }

Name must be unique identifier.

The distribution array is the statistical distribution of sprites. 

Ideally the percentages weights have to reduce to a sum of 100%, but a normalization algorithm is applied. Be careful to have as many entries in the "distro" array than sprites number of the spritesheet depicted in the current layer's configuration.

