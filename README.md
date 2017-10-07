
ParaScroll README
=================

Welcome to ParaScrolll README file !

This introduce to paralax scroller effect

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
      "background": "tranparent",
      "ssurl": "parascroll/spritesheet.png",
      "distro": [20, 80]
    }

Name must be unique identifier.

The distrivution array is the statistical distribution of sprites. Ideally the percentages weights have to reduce to a sum of 100%, but a normalization algorithm is applied. Be careful to have as many entries in the "distro" array than sprites number of the spritesheet depicted in "ssurl" entry of the current layer's configuration.

