
export default class Sprite {

  /**
   * constructs a sprite
   *
   * @param {String} url - of the spritesheet
   * @param {Image} img - image data (spritesheet)
   * @param {Number} idx - sprite index into the spritesheet
   */
  constructor(url, img, slotsCount, idx) {
    this.url = url
    this.img = img
    this.slotsCount = slotsCount
    this.idx = idx
    this.elm = null

    // real sprite dimensions
    this.realWidth = img.width / slotsCount
    this.realHeight = img.height
    this.realRatio = this.realWidth / this.realHeight
 
    // coordinates
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

    console.log([this.height, this.width])
  }

  /**
   * update position
   *
   */
  update(deltaTop, deltaLeft) {
    this.top += deltaTop
    this.left += deltaLeft

  }

  /**
   * re,der sprite
   *
   *
   */
  render() {
    let h = this.img.height
    let w = this.img.width
    let rh = h / this.height
    let rw = w / this.width

    this.elm.style.top = this.top + 'px'
    this.elm.style.left = this.left + 'px'
    this.elm.style.width = this.width + 'px'
    this.elm.style.height = this.height + 'px'

    this.elm.style.backgroundSize =  (w /rh)  + 'px' + ' ' + (h / rh) + 'px'

    let bp = (-1 * this.idx * w / rw) + 'px' + ' ' + '0px'
    this.elm.style.backgroundPosition = bp
  }
}
