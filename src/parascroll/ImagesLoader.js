
export default class ImagesLoader {

  constructor() {
    this.UUID = 0
    this.promises = []

    this.successHandler = (images) => { console.log(Object.keys(images)) }
    this.errorHandler = (msg) => { console.log(msg) }
  }

  add(key, url) {
    let img = new Image()
    let promise = {
      uuid: this.UUID++,
      url: url,
      key: key,
      img: img,
      status: 'init'
    }

    img.src = url

    img.onload = ((event) => {
      promise.status = 'fullfilled'
      this.resolve()
    }) // .bind(this)

    img.onerror = ((event) => {
      promise.status = 'rejected'
      this.reject()
    }) // .bind(this)

    this.promises.push(promise)

    return this
  }

  onsuccess(cb) {
    this.successHandler = cb

    return this
  }

  onerror(cb) {
    this.errorHandler = cb

    return this
  }

  resolve() {
    let all = true
    let images = {}

    this.promises.forEach((promise) => {
      all = all && promise.status === 'fullfilled'
      images[promise.key] = promise.img
    })

    if(all) {
      this.successHandler.call(this, images)
    }
  }

  reject() {
    let any = false
    let msg = ''

    this.promises.forEach((promise) => {
      console.log(promise)

      any = any || promise.status === 'rejected'

      if(promise.status === 'rejected') {
        msg = promise.img.src
        console.log(promise.uuid)
      }
    })

    if(any) {
      this.errorHandler.call(this, 'error loading some image ' + msg)
    }
  }
}
