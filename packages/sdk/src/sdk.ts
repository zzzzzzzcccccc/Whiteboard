import App from './app'

class Sdk {
  private readonly _app: App

  constructor(private readonly target: HTMLElement) {
    this._app = new App()
  }

  public render() {
    this._app.render()
    this.target.appendChild(this.view)
  }

  public destroy() {
    this.target.removeChild(this.view)
    this._app.destroy()
  }

  get app() {
    return this._app
  }

  get view() {
    return this._app.instance.view as HTMLCanvasElement
  }
}

export default Sdk
