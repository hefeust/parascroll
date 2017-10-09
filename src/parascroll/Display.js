
import ImagesLoader from './ImagesLoader'

export default class Display {

  /**
   * Display class constructor
   *
   * @param {HTMLElement} container
   * @param {Object} options
   */
  constructor(container, options) {
    this.elm = container

    if(!options) {
      throw new Error('Missing "display" section in theme JSON file !')
    }

    this.elm.style.height = options.height,
		this.elm.style.width = options.width,
		this.elm.style.backgroundColor = options.background,
		this.elm.style.position = 'absolute'
    this.fps = options.fps
  }

  install (theme, images) {
    theme.installTo(this.elm, images)
  }

}
