
export default class Sprite {

  /**
   * constructs a sprite
   *
   * @param {String} url - of the spritesheet
   * @param {Image} img - image data (spritesheet)
   * @param {Number} idx - sprite index into the spritesheet
   */
  constructor(options) {
    this.elm = null
    this.url = options.url
    this.img = options.img
    this.spritesCount = options.spritesCount
    this.spriteNumber = options.spriteNumber
    this.layerIdx = options.layerIdx
    this.layerElmClientWidth = options.layerElmClientWidth
    this.slotsCount = options.slotsCount

    // real sprite dimensions
    this.realWidth = this.img.width / this.spritesCount
    this.realHeight = this.img.height
    this.realRatio = this.realWidth / this.realHeight

    // coordinates into layer
    this.top = 0
    this.left = 0
    this.width = 0
    this.height = 0
  }

  /**
   * install into the DOM
   *
   * @param {HTMLElement} container
   */
  installTo(container) {
    this.elm = document.createElement('div')

    this.elm.className = 'sprite'
    this.elm.style.backgroundImage = 'url(' + this.url + ')'
    this.elm.style.backgroundRepeat = 'no-repeat'
    this.elm.style.position = 'absolute'

    container.appendChild(this.elm)

    this.height = container.clientHeight
    this.width = container.clientHeight * this.realRatio

    this.top = 0
    this.left = this.layerIdx * this.width
  }

  /**
   * update position
   *
   */
  update(velocity) {
    this.top = 0
    this.left -= velocity

    if(this.left + this.width + velocity <= 0) {
      this.left += this.width * this.slotsCount
    }
  }

  /**
   * render sprite
   *
   */
  render() {
    let transformRatio = this.height / this.realHeight
    let h = this.realHeight * transformRatio
    let w = h * this.realRatio

    // w * h
    let s = (this.spritesCount * w) + 'px' + ' ' + h + 'px'
    let p = (-1 * this.spriteNumber * w) + 'px' + ' ' + '0px'

    this.elm.style.backgroundPosition = p
    this.elm.style.backgroundSize = s

    this.elm.style.top = this.top + 'px';
    this.elm.style.left = this.left + 'px';
    this.elm.style.width = this.width + 'px';
    this.elm.style.height = this.height + 'px';
  }
}
