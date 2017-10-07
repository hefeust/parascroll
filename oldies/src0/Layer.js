
import Sprite from './Sprite'

export default class Layer {

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
    this.slotsCount = this.distro.length
    
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

    this.visibleSpritesCount = Math.floor(cw / ch)

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
    for(let i = 0; i < 2 * this.visibleSpritesCount; i++) {
      let dice = Math.random()
      let sn = -1

      for(let j = 0; j < intervals.length - 1; j++) {
        if(intervals[j] <= dice && dice < intervals[j + 1]) {
          sn = j
          break
        }
      }

      //this.slots.push({sn})
      // console.log(this.ssimg)

      this.sprites.push(new Sprite(
        this.ssurl, this.ssimg, this.slotsCount, sn
      ))
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
    let top = 0
    let left = 0
    let height = 0
    let width = 0

    // update layer position
    this.offset += this.velocity

    this.sprites.forEach((sprite, idx) => {

      left =  idx * this.elm.clientHeight - this.offset
      top = 0
      height = this.elm.clientHeight
      width = this.elm.clientHeight

      sprite.update(top, left, height, width)
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
