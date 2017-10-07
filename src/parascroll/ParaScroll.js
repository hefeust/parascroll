
import Theme from './Theme'
import Display from './Display'
import ImagesLoader from './ImagesLoader'

export default class ParaScroll {

  constructor(container, settings) {
    this.theme = new Theme(settings.layers)
    this.display = new Display(container, settings.display)

    this.fps = settings.display.fps
  }

  run() {
    let imgsloader = new ImagesLoader()

    // each layer have to configure the async ImagesLoader
    this.theme.configure(imgsloader)

    // once the images are loaded...
    imgsloader.onsuccess((images) => {

      // install theme inside DOM display
      this.display.install(this.theme, images)

      // run the temporization
      setInterval(() => {
        this.theme.update()
        this.theme.render()
      }, 1000 / this.fps )
    })
  }
}
