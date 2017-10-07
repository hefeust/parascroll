
export default class Sprite {

  /**
   * constructs a sprite
   *
   * @param {String} url - of the spritesheet
   * @param {Image} img - image data (spritesheet)
   * @param {Number} idx - sprite index into the spritesheet
   */
  constructor(url, img, spritesCount, spriteNumber) {
    this.url = url
    this.img = img
    this.spritesCount = spritesCount
    this.spriteNumber = spriteNumber
    this.elm = null

    console.log(spritesCount)
    console.log([img.width, img.height])

    // real sprite dimensions
    this.realWidth = img.width / spritesCount
    this.realHeight = img.height
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

    console.log('RR ' + this.realRatio)
    console.log('CH ' + container.clientHeight)


  }

  /**
   * update position
   *
   */
  update(layerOffset, layerIdx) {
    this.top = 0
    this.left = layerIdx * this.width + layerOffset

    //if(this.left + this.width < 0) {
//      this.left = this.width * this.slotsCount + this.layerOffset
    //}
  }

  /**
   * render sprite
   *
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

    console.log(this.left)
  }
}
