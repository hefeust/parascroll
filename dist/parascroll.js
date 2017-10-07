var ParaScroll = (function () {
'use strict';

var Sprite$1 = function Sprite(url, img, spritesCount, spriteNumber) {
  this.url = url;
  this.img = img;
  this.spritesCount = spritesCount;
  this.spriteNumber = spriteNumber;
  this.elm = null;

  console.log(spritesCount);
  console.log([img.width, img.height]);

  // real sprite dimensions
  this.realWidth = img.width / spritesCount;
  this.realHeight = img.height;
  this.realRatio = this.realWidth / this.realHeight;

  // coordinates into layer
  this.top = 0;
  this.left = 0;
  this.width = 0;
  this.height = 0;

};

/**
 * install into the DOM
 *
 * @param {HTMLElement} container
 */
Sprite$1.prototype.installTo = function installTo (container) {
  this.elm = document.createElement('div');

  this.elm.className = 'sprite';
  this.elm.style.backgroundImage = 'url(' + this.url + ')';
  this.elm.style.backgroundRepeat = 'no-repeat';
  this.elm.style.position = 'absolute';

  container.appendChild(this.elm);

  this.height = container.clientHeight;
  this.width = container.clientHeight * this.realRatio;

  console.log('RR ' + this.realRatio);
  console.log('CH ' + container.clientHeight);


};

/**
 * update position
 *
 */
Sprite$1.prototype.update = function update (layerOffset, layerIdx) {
  this.top = 0;
  this.left = layerIdx * this.width + layerOffset;

  //if(this.left + this.width < 0) {
//    this.left = this.width * this.slotsCount + this.layerOffset
  //}
};

/**
 * render sprite
 *
 *
 */
Sprite$1.prototype.render = function render () {
  var transformRatio = this.height / this.realHeight;
  var h = this.realHeight * transformRatio;
  var w = h * this.realRatio;

  // w * h
  var s = (this.spritesCount * w) + 'px' + ' ' + h + 'px';
  var p = (-1 * this.spriteNumber * w) + 'px' + ' ' + '0px';

  this.elm.style.backgroundPosition = p;
  this.elm.style.backgroundSize = s;

  this.elm.style.top = this.top + 'px';
  this.elm.style.left = this.left + 'px';
  this.elm.style.width = this.width + 'px';
  this.elm.style.height = this.height + 'px';

  console.log(this.left);
};

var Layer = function Layer(options) {
  this.name = options.name;
  this.velocity = options.velocity;
  this.background = options.background;
  this.top = options.top;
  this.left = options.left;
  this.width = options.width;
  this.height = options.height;
  this.ssurl = options.spritesheet;
  this.distro = options.distro;

  this.visibleSpritesCount = 0;
  this.slotsCount = 2 * this.visibleSpritesCount;

  // for animation
  this.offset = 0;
  this.sprites = [];
};

/**
 * configure the image loader
 *with the spritesheet
 *
 * @param {ImagesLoader} imgsloader
 */
Layer.prototype.configure = function configure (imgsloader) {
  imgsloader.add(this.name, this.ssurl);
};

/**
 * populate layer with sprites according to distro
 *
 */
Layer.prototype.populate = function populate () {
    var this$1 = this;

  var cw = this.elm.clientWidth;
  var ch = this.elm.clientHeight;

  this.visibleSpritesCount = Math.floor(cw / (this.sratio * ch));
  this.slotsCount = 2 * this.visibleSpritesCount;

  // let's make weights total
  var total = this.distro.reduce(function (acc, val) { return acc + val; }, 0);

  // lets compute weighted intervals
  var intervals = [0].concat(this.distro)
    .map(function (val, idx, arr) {
      var bound = arr.reduce(function (acc, x, i) { return (i < idx ? acc + x : acc); }, 0);

      return (idx === 0 ? 0 : bound + val)
    })
    .map(function (val) { return val / total; } );

  // let's populate slots with sprites number (sn)
  for(var i = 0; i < this.slotsCount; i++) {
    var dice = Math.random();
    var spriteNumber = -1;

    for(var j = 0; j < intervals.length - 1; j++) {
      if(intervals[j] <= dice && dice < intervals[j + 1]) {
        spriteNumber = j;
        break
      }
    }

    this$1.sprites.push(new Sprite$1(
      this$1.ssurl, this$1.ssimg, this$1.spritesCount, spriteNumber
    ));
  }
};

/**
 * install to DOM container
 *
 * @param {HTMElement} container
 * @param {Object} images
 */
Layer.prototype.installTo = function installTo (container, images) {
    var this$1 = this;

  this.ssimg = images[this.name];

  // sratio and spritesCount
  this.sratio = this.ssimg.width / (this.distro.length * this.ssimg.height);
  this.spritesCount = this.distro.length;

  // let layout = document.createElement('div')
  this.elm = document.createElement('div');

  this.elm.className = 'layer';
  this.elm.style.top = this.top;
  this.elm.style.left = this.left;
  this.elm.style.width = this.width;
  this.elm.style.height = this.height;
  this.elm.style.backgroundColor = this.background;
  this.elm.style.position = 'absolute';
  this.elm.style.overflow = 'hidden';

  container.appendChild(this.elm);

  // once we have inserted into the document
  // we can compute real height and idth
  // determine slots number
  // then populate layer
  this.populate();

  this.sprites.forEach(function (sprite) {
    sprite.installTo(this$1.elm);
  });
};

/**
 * update llayer
 *
 * so it moves by 'brlovity' amount on each frame
 */
Layer.prototype.update = function update () {
    var this$1 = this;


  // update layer position
  this.offset -= this.velocity;

  if(this.offset <= -2 * this.elm.clientWidth) {
     this.offset += 2 *this.elm.clientWidth;
  }

  this.sprites.forEach(function (sprite, idx) {
    sprite.update(this$1.offset, idx);
  });
};

/**
 * renders the frame
 *
 */
Layer.prototype.render = function render () {
  this.sprites.forEach(function (sprite) {
    sprite.render();
  });
};

Layer.prototype.toString = function toString () {
  var text = '';

  text += 'Layer: ' + this.name + '\n';
  text += 'distro :' + this.sprites.reduce(
    function (acc, s) { return acc + ' '+ s.idx}, ' '
  ) + '\n';

  text += 'Geometry:'
    + this.elm.clientWidth
    + ' * '
    + this.elm.clientHeight + '\n';

  return text
};

var Theme = function Theme(settings) {
  var this$1 = this;

  this.layers = [];

  if(!settings.length) {
    throw new Error('Missing "layers" section (array) in  theme JSON file !' )
  }

  settings.forEach(function (ls) {
    var layer = new Layer(ls);

    this$1.layers.push(layer);
  });
};

Theme.prototype.configure = function configure (imgsloader) {
  this.layers.forEach(function (layer) {
    layer.configure(imgsloader);
  });
};

Theme.prototype.installTo = function installTo (container, images) {
  console.log('Layer#installTo');

  this.layers.forEach(function (layer) {
    layer.installTo(container, images);
  });

  //console.log(this.layers.join('\n'))
  console.log(this.layers);
};

Theme.prototype.update = function update () {
  this.layers.forEach(function (layer) {
    layer.update();
  });
};

Theme.prototype.render = function render () {
  this.layers.forEach(function (layer) {
    layer.render();
  });
};

var ImagesLoader = function ImagesLoader() {
  this.UUID = 0;
  this.promises = [];

  this.successHandler = function (images) { console.log(Object.keys(images)); };
  this.errorHandler = function (msg) { console.log(msg); };
};

ImagesLoader.prototype.add = function add (key, url) {
    var this$1 = this;

  var img = new Image();
  var promise = {
    uuid: this.UUID++,
    url: url,
    key: key,
    img: img,
    status: 'init'
  };

  img.src = url;

  img.onload = (function (event) {
    promise.status = 'fullfilled';
    this$1.resolve();
  }); // .bind(this)

  img.onerror = (function (event) {
    promise.status = 'rejected';
    this$1.reject();
  }); // .bind(this)

  this.promises.push(promise);

  return this
};

ImagesLoader.prototype.onsuccess = function onsuccess (cb) {
  this.successHandler = cb;

  return this
};

ImagesLoader.prototype.onerror = function onerror (cb) {
  this.errorHandler = cb;

  return this
};

ImagesLoader.prototype.resolve = function resolve () {
  var all = true;
  var images = {};

  this.promises.forEach(function (promise) {
    all = all && promise.status === 'fullfilled';
    images[promise.key] = promise.img;
  });

  if(all) {
    this.successHandler.call(this, images);
  }
};

ImagesLoader.prototype.reject = function reject () {
  var any = false;
  var msg = '';

  this.promises.forEach(function (promise) {
    console.log(promise);

    any = any || promise.status === 'rejected';

    if(promise.status === 'rejected') {
      msg = promise.img.src;
      console.log(promise.uuid);
    }
  });

  if(any) {
    this.errorHandler.call(this, 'error loading some image ' + msg);
  }
};

var Display = function Display(container, options) {
  this.elm = container;

  if(!options) {
    throw new Error('Missing "display" section in theme JSON file !')
  }

  this.elm.style.height = options.height,
		this.elm.style.width = options.width,
		this.elm.style.backgroundColor = options.background,
		this.elm.style.position = 'absolute';
  this.fps = options.fps;

};

Display.prototype.install = function install (theme, images) {
  theme.installTo(this.elm, images);
};

// possiblt deprecated
Display.prototype.run = function run (theme) {
    var this$1 = this;

  var imgloader = new ImagesLoader();

  theme.layers.forEach(function (layer) {
    imgloader.add(layer.name, layer.ssurl);
  });

  imgloader.onsuccess(function (images) {
    theme.layers.forEach(function (layer) {
      var ssurl = layer.ssurl;
      var img = images[layer.name];

      layer.slots.forEach(function (slot, idx) {
        var sprite = new Sprite(ssurl, img, slot);
        var height = layer.elm.clientHeight;
        var width = height;
        var top = 0;
        var left = height * idx;

        setInterval(function () {
          sprite.installTo(layer.elm);
          sprite.render(top, left, height, width);
        }, 1000 / this$1.fps);


      });
    });
  });
};

var ParaScroll = function ParaScroll(container, settings) {
  this.theme = new Theme(settings.layers);
  this.display = new Display(container, settings.display);

  this.fps = settings.display.fps;
};

ParaScroll.prototype.run = function run () {
    var this$1 = this;

  var imgsloader = new ImagesLoader();

  // each layer have to configure the async ImagesLoader
  this.theme.configure(imgsloader);

  // once the images are loaded...
  imgsloader.onsuccess(function (images) {

    // install theme inside DOM display
    this$1.display.install(this$1.theme, images);

    // run the temporization
    setInterval(function () {
      this$1.theme.update();
      this$1.theme.render();
    }, 1000 / this$1.fps );
  });
};

return ParaScroll;

}());
