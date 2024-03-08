import App from './app'
import type { Block } from '@yyz/blocks'

class Sdk {
  private readonly _app: App

  private static handlerOnWheel(event: WheelEvent) {
    event.stopPropagation()
    event.preventDefault()
  }

  constructor(private readonly target: HTMLElement) {
    this._app = new App()
  }

  public render() {
    this._app.render()
    this.target.addEventListener('wheel', Sdk.handlerOnWheel, { passive: false })
    this.target.appendChild(this.view)
  }

  public destroy() {
    this.target.removeEventListener('wheel', Sdk.handlerOnWheel)
    this.target.removeChild(this.view)
    this._app.destroy()
  }

  public addBlocks<T extends Block>(blocks: T[]) {
    this._app.addBlocks(blocks)
  }

  public removeBlocks<T extends Block>(blocks: T[]) {
    this._app.removeBlocks(blocks)
  }

  get app() {
    return this._app
  }

  get view() {
    return this._app.instance.view as HTMLCanvasElement
  }
}

export default Sdk
