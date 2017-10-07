

/**
 * random integer generator
 *
 * @param {Number} limit
 * @return {Number}
 */
var dice = function(limit) {
  return Math.floor(1 + limit * Math.random());
};

function SpriteSheet(image, ncols, nrows) {
  this.img = image;
  this.ncols = ncols;
  this.nrows = nrows;
  this.refs = {};
}

SpriteSheet.prototype.ref = function(key, row, col) {
  this.refs[key] = { row : row, col : col };
};

SpriteSheet.prototype.draw = function(ctx, key, x, y, scale) {
  var
    scale = scale || 1,
    ref = this.refs[key],


    // source image
    sx = ref.col * this.img.width / this.ncols,
    sy = ref.row * this.img.height / this.nrows,
    sw = this.img.width / this.ncols,
    sh = this.img.height / this.nrows,

    //  destination in canvas
    dx = x,
    dy = y,
    dw = sw * scale,
    dh = sh * scale;

  // console.log('%s %s', this.nrows, this.ncols);
  // console.log('%s %s', this.img.width, this.img.height);
  // console.log('%s %s %s %s', sx, sy, sw, sh);
  // console.log('%s %s %s %s', dx, dy, dw, dh);

  ctx.drawImage(this.img, sx, sy, sw, sh, dx, dy, dw, dh);
};

function Distro(stops) {
  this.stops = [0].concat(stops).concat([100]);

   // console.log(this.stops);
}

Distro.prototype.index = function(value) {
  var index = 0;

  for(var i = 0; i < this.stops.length - 1; i++) {
    if(value > this.stops[i] && value <= this.stops[i + 1]) {
      index = i;
      break;
    }
  }
  // console.log(index);

  return index;
};

function RingBuffer(length) {
  this.buffer = new Array(length);
  this.length = length;
  this.writing_offset = 0;
  this.reading_offset = 0;
}

RingBuffer.prototype.write = function(value) {
  this.buffer[this.writing_offset++] = value;
  this.writing_offset = this.writing_offset % this.length;
};

RingBuffer.prototype.read = function() {
  var value = this.buffer[this.reading_offset++];

  this.reading_offset = this.reading_offset % this.length;

  return value;
};

RingBuffer.prototype.peek = function(offset) {
  var index = (offset + this.reading_offset) % this.length;
  var value = this.buffer[index];

  return value;
};


function Layer(nsprites, velocity) {
  this.nsprites = nsprites;
  this.velocity = velocity;
  this.items = new RingBuffer(2 * nsprites);
  this.scrollIndex = 0;
  this.offset = 0;
}

Layer.prototype.setGeometry = function(geometry) {
  this.x = geometry.x;
  this.y = geometry.y;
  this.w = geometry.w;
  this.h = geometry.h;
};

Layer.prototype.setStyles = function(styles) {
  this.styles = styles;
};

Layer.prototype.setDistro = function(values) {
  this.distro = new Distro(values);
};

Layer.prototype.populate = function() {
  var keys = ['tower', 'house', 'pinetree', 'wood', 'empty'];
  var rand = 100;
  var k = 'empty';

  for(var i = 0; i < this.nsprites; i++) {
    rand = dice(100);
    k = keys [ this.distro.index(rand) ];
    this.items.write(k);
  }
};

Layer.prototype.scroll = function() {

  var sprite_w = this.w / this.nsprites,
    nsteps = Math.floor(sprite_w / this.velocity),
    step_w = this.w / (nsteps * this.nsprites),
    nsteps_elapsed = Math.floor((-1 * this.offset) / step_w);

  this.offset -= this.velocity;

  // console.log(step_w);
  // console.log('steps : %s / %s', nsteps_elapsed, nsteps);

  if(nsteps - nsteps_elapsed - 1 < 0) {
    this.offset += step_w * nsteps;
    this.scrollIndex++;
    this.items.read();

    // consoole.log('scrollIndex++');

    if(this.scrollIndex  > this.nsprites) {
      this.scrollIndex = 0;
      this.populate();

      // consoole.log('populate');
    }
  }
};


Layer.prototype.drawFloor = function(ctx) {
/*
  A----B
  |    |
  D----C
*/

  var
    ax = this.x,
    ay = this.y + 0.5 * this.h,
    bx = this.x + this.w,
    by = ay,
    cx = bx,
    cy = this.y + this.h,
    dx = ax
    dy = cy;

  ctx.fillStyle = this.styles.floorColor;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.lineTo(dx, dy);
  ctx.closePath();
  ctx.fill();
};

Layer.prototype.drawSprites = function(ctx, ss) {
  var key = 'empty';
  var idx = 0;
  var spx = 0; spy = 0;
  var coeff = 1.5;
  // var scale = coeff * 1024 / (200 * this.nsprites);
  var scale = 1;
  var sprite_w = this.w / this.nsprites;

  //console.log(scale);

  for(var i = 0; i < this.nsprites; i++) {
//    idx = i + this.scrollIndex;
    key = this.items.peek(i);

    spx = this.x +  this.offset + i * sprite_w;
    spy = this.y + this.h * 0.2 / coeff;

    // console.log('idx %s', idx);
    // console.log('offset %s', this.offset);
    // console.log('sp %s %s %s', key, spx, spy);
    // console.log(i + ' ' + key);

    ss.draw(ctx, key, spx, spy, scale);

    ctx.font = '48px Helvetica Bold';
    ctx.fillText(i, spx, spy + 50);
    ctx.strokeText(i, spx, spy + 50);
  }
};


Layer.prototype.draw = function(ctx, ss) {
  this.drawFloor(ctx);
  this.drawSprites(ctx, ss);
};

winload(function() {

  var canvas = document.getElementById('parallax');
  var ctx = canvas.getContext('2d');
  var ss = null;

  var layers = [];

  canvas.setAttribute('width', 1024);
  canvas.setAttribute('height', 768);
  canvas.style.backgroundColor = '#55bada';

  layers[0] = new Layer(21, 3);
  layers[0].setGeometry({
    x : 0, y : 280,
    w : 1500, h : 200
  });
  layers[0].setStyles({ floorColor : '#1e8e1e' });
  layers[0].setDistro([10, 30, 60, 90]);
  layers[0].populate();
  layers[0].populate();

  layers[1] = new Layer(11, 5);
  layers[1].setGeometry({
    x : 0, y : 300,
    w : 1500, h : 250
  });
  layers[1].setStyles({ floorColor : '#1e6e3e' });
  layers[1].setDistro([10, 30, 60, 90]);
  layers[1].populate();
  layers[1].populate();

  layers[2] = new Layer(6, 1);
  layers[2].setGeometry({
    x : 0, y : 350,
    w : 1500, h : 300
  });
  layers[2].setStyles({ floorColor : '#1e4e2e' });
  layers[2].setDistro([10, 30, 60, 90]);
  layers[2].populate();
  layers[2].populate();

  console.log(layers[0]);
  console.log(layers[1]);
  console.log(layers[2]);

  var img = new Image();
  img.src = 'images/spritesheet.png';
  img.onload = function(event) {

    ss = new SpriteSheet(img, 5, 3);

    ss.ref('tower', 0, 0);
    ss.ref('house', 0, 1);
    ss.ref('pinetree', 0, 2);
    ss.ref('wood', 0, 3);
    ss.ref('empty', 0, 4);

    update();
  };

//  var u = 0;
  function update() {
//   u++;
//   if(u < 20) requestAnimationFrame(update);
 requestAnimationFrame(update);

   ctx.clearRect(0, 0, 1024, 768);

   for(var i = 0; i < layers.length; i++) {
    layers[i].scroll();
    layers[i].draw(ctx, ss);
   }
  }

  // upfate();
});
