import { EmitterEventName, EventNameSpace } from '../../../enums'
import options from '../../../options'
import App from '../../app'
import Viewport from '../viewport'
import Background from './background'

class Whiteboard {
  private readonly _app: App
  private readonly _viewport: Viewport
  private readonly _background: Background

  constructor(app: App) {
    this._app = app
    this._viewport = new Viewport({
      worldWidth: options.whiteboard.width,
      worldHeight: options.whiteboard.height,
      screenWidth: options.screen.width,
      screenHeight: options.screen.height,
    })
    this._background = new Background()
    this.render()
    this.registerEvents()
  }

  public destroy() {
    this._viewport.destroy()
  }

  private render() {
    const children = [...Object.values(this._background.instance)]
    this._viewport.addChild(...children)
  }

  private registerEvents() {
    this._viewport.wheel()
    this._app.events.on(EmitterEventName.RESIZE_CHANGE, this.handleOnResizeChange.bind(this))
    this._app.pixiEvents.register(EventNameSpace.WHITEBOARD, this._viewport.instance, ['moved', 'zoomed'])
  }

  private handleOnResizeChange() {
    this._viewport.render({
      screenWidth: options.screen.width,
      screenHeight: options.screen.height,
    })
  }

  get instance() {
    return this._viewport.instance
  }

  get viewport() {
    return this._viewport
  }
}

export default Whiteboard
