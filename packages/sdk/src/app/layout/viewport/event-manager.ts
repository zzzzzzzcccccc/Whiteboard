import * as PIXI from 'pixi.js'
import Viewport from './viewport'
import { ViewportEventMapper } from './types'
import { PixiWithExtra } from '../../../types'
import { STATIC } from '../../../constant'

const PIXI_EVENT_MAPPER: Record<string, ViewportEventMapper> = {
  pointerdown: {
    name: 'down',
  },
  pointermove: {
    name: 'move',
  },
  pointerup: {
    name: 'up',
  },
  pointerupoutside: {
    name: 'up',
  },
  pointercancel: {
    name: 'up',
  },
  wheel: {
    name: 'wheel',
  },
}

class EventManager {
  private readonly _viewport: Viewport
  private _handler = new Map<string, ((event: any, item: ViewportEventMapper) => void)[]>()

  constructor(viewport: Viewport) {
    this._viewport = viewport
    this.registerEvents()
  }

  public on<Event>(event: string, callback: (event: Event, item: ViewportEventMapper) => void) {
    if (!this._handler.has(event)) {
      this._handler.set(event, [])
    }
    this._handler.get(event)?.push(callback)
  }

  public off<Event>(event: string, callback: (event: Event, item: ViewportEventMapper) => void) {
    if (!this._handler.has(event)) {
      return
    }
    const callbacks = this._handler.get(event)
    const index = callbacks?.findIndex((cb) => cb === callback)
    if (index !== undefined && index !== -1) {
      callbacks?.splice(index, 1)
    }
  }

  public emit(name: string, ...args: any[]) {
    this._viewport.instance.emit(name, ...args)
  }

  public destroy() {
    this._handler.clear()
  }

  private registerEvents() {
    const container = this._viewport.instance as PixiWithExtra<PIXI.Container>
    container.eventMode = STATIC
    container.sortableChildren = true
    Object.keys(PIXI_EVENT_MAPPER).forEach((event) => {
      container.on?.(event, this.handleOnListener.bind(this, PIXI_EVENT_MAPPER[event]))
    })
  }

  private handleOnListener<Event>(item: ViewportEventMapper, event: Event) {
    const callbacks = this._handler.get(item.name)
    if (callbacks?.length) {
      callbacks.forEach((cb) => cb(event, item))
    }
  }

  get handler() {
    return this._handler
  }
}

export default EventManager
