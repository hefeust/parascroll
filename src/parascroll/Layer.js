
import Sprite from './Sprite'

export default class Layer {

  /**
   * the laye xlass
   *
   * @param {Object} options - from JSON theme
   */
  constructor(options) {
    this.name = options.name
    this.velocity = options.velocity
    this.background = options.background
    this.top = options.top
    this.left = options.left
    this.width = options.width
    this.height = options.height
    this.ssurl = options.spritesheet
    this.distro = options.distro

    this.visibleSpritesCount = 0
    this.slotsCount = 2 * this.visibleSpritesCount

    // for animation
    this.offset = 0
    this.sprites = []
  }

  /**
   * configure the image loader
   *  with the spritesheet
   *
   * @param {ImagesLoader} imgsloader
   */
  configure(imgsloader) {
    imgsloader.add(this.name, this.ssurl)
  }

  /**
   * populate layer with sprites according to distro
   *
   */
  populate() {
    let cw = this.elm.clientWidth
    let ch = this.elm.clientHeight

    this.visibleSpritesCount = Math.floor(cw / (this.sratio * ch))
    this.slotsCount = 2 * this.visibleSpritesCount

    // let's make weights total
    let total = this.distro.reduce((acc, val) => acc + val, 0)

    // lets compute weighted intervals
    let intervals = [0].concat(this.distro)
      .map((val, idx, arr) => {
        let bound = arr.reduce((acc, x, i) => (i < idx ? acc + x : acc), 0)

        return (idx === 0 ? 0 : bound + val)
      })
      .map((val) => val / total )

    // let's populate slots with sprites number (sn)
    for(let i = 0; i < this.slotsCount; i++) {
      let dice = Math.random()
      let spriteNumber = -1

      for(let j = 0; j < intervals.length - 1; j++) {
        if(intervals[j] <= dice && dice < intervals[j + 1]) {
          spriteNumber = j
          break
        }
      }

        this.sprites.push(new Sprite({
          url: this.ssurl,
          img: this.ssimg,
          spritesCount: this.spritesCount,
          spriteNumber: spriteNumber,
          layerIdx: i,
          slotsCount : this.slotsCount,
          layerElmClientWidth: this.elm.clientWidth
        }))
    }
  }

  /**
   * install to DOM container
   *
   * @param {HTMElement} container
   * @param {Object} images
   */
  installTo(container, images) {
    this.ssimg = images[this.name]

    // sratio and spritesCount
    this.sratio = this.ssimg.width / (this.distro.length * this.ssimg.height)
    this.spritesCount = this.distro.length

    // let layout = document.createElement('div')
    this.elm = document.createElement('div')

    this.elm.className = 'layer'
    this.elm.style.top = this.top
    this.elm.style.left = this.left
    this.elm.style.width = this.width
    this.elm.style.height = this.height
    this.elm.style.backgroundColor = this.background
    this.elm.style.position = 'absolute'
    this.elm.style.overflow = 'hidden'

    container.appendChild(this.elm)

    // once we have inserted into the document
    // we can compute real height and idth
    // determine slots number
    // then populate layer
    this.populate()

    this.sprites.forEach((sprite) => {
      sprite.installTo(this.elm)
    })
  }

  /**
   * update llayer
   *
   * so it moves by 'brlovity' amount on each frame
   */
  update() {
     // do sprites manage their own offset ?
     // set it up at install time !

    // update layer position
    this.offset -= this.velocity

    if(this.offset <= -2 * this.elm.clientWidth) {
       this.offset +=  2   * this.elm.clientWidth
    }

    this.sprites.forEach((sprite, idx) => {
      // sprite.update(this.offset)
      sprite.update(this.velocity)
    })
  }

  /**
   * renders the frame
   *
   */
  render() {
    this.sprites.forEach((sprite) => {
      sprite.render()
    })
  }

  toString() {
    let text = ''

    text += 'Layer: ' + this.name + '\n'
    text += 'distro :' + this.sprites.reduce(
      (acc, s) => { return acc + ' '  + s.idx}, ' '
    ) + '\n'

    text += 'Geometry:'
      + this.elm.clientWidth
      + ' * '
      + this.elm.clientHeight + '\n'

    return text
  }
}
