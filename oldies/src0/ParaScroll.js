
import Theme from './Theme'
import Display from './Display'
import ImagesLoader from './ImagesLoader'

export default class ParaScroll {

  constructor(container, settings) {
    this.theme = new Theme(settings.layers)
    this.display = new Display(container, settings.display)
  }

  run() {
    let imgsloader = new ImagesLoader()

    this.theme.configure(imgsloader)

    imgsloader.onsuccess((images) => {
      this.display.install(this.theme, images)

      this.theme.update()
      this.theme.render()
    })
  }
}
