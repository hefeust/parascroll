
import Layer from './Layer'

export default class Theme {

  /**
   * constructs a new Theme
   *
   * @param {Object} settings - from JSON file
   */
  constructor(settings) {
    this.layers = []

    if(!settings.length) {
      throw new Error('Missing "layers" section (array) in  theme JSON file !' )
    }

    settings.forEach((ls) => {
      let layer = new Layer(ls)

      this.layers.push(layer)
    })
  }

  configure(imgsloader) {
    this.layers.forEach((layer) => {
      layer.configure(imgsloader)
    })
  }

  installTo(container, images) {
    console.log('Layer#installTo')

    this.layers.forEach((layer) => {
      layer.installTo(container, images)
    })

    //console.log(this.layers.join('\n'))
    console.log(this.layers)
  }

  update() {
    this.layers.forEach((layer) => {
      layer.update()
    })
  }

  render() {

   // this.layers[0].render()
   // this.layers[1].render()
   // this.layers[2].render()

    this.layers.forEach((layer) => {
      layer.render()
    })
  }

}
