
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

  install(theme, images) {
    theme.installTo(this.elm, images)
  }

  // possiblt deprecated
  run(theme) {
    let spritesheets = {}
    let imgloader = new ImagesLoader()

    theme.layers.forEach((layer) => {
      imgloader.add(layer.name, layer.ssurl)
    })

    imgloader.onsuccess((images) => {
      theme.layers.forEach((layer) =>  {
        let ssurl = layer.ssurl
        let img = images[layer.name]

        layer.slots.forEach((slot, idx) => {
          let sprite = new Sprite(ssurl, img, slot)
          let height = layer.elm.clientHeight
          let width = height
          let top = 0
          let left = height * idx

          setInterval(() => {
            sprite.installTo(layer.elm)
            sprite.render(top, left, height, width)
          }, 1000 / this.fps)


        })
      })
    })
  }
}
