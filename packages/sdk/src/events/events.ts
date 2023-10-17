import { FederatedEventHandler, FederatedPointerEvent } from '@pixi/events'
import { EventNameSpace } from '../enums'
import { EventInstance } from '../types'

class Events {
  private readonly _instance = new Map<EventNameSpace, EventInstance>()

  public register<Target>(name: EventNameSpace, target: Target, events: string[], beforeCallback?: () => void) {
    if (this.hasNameSpace(name, false)) {
      throw new Error(`Event instance ${name} already exists`)
    }
    beforeCallback?.()
    const item = {
      target,
      listeners: events.reduce((acc, eventName) => {
        acc.set(eventName, new Set<FederatedEventHandler>())
        return acc
      }, new Map<string, Set<FederatedEventHandler>>()),
    } as EventInstance<Target>
    this._instance.set(name, item)
    this.addListeners(item)
  }

  public on<T = FederatedPointerEvent>(name: EventNameSpace, event: string, handler: FederatedEventHandler<T>) {
    this.hasNameSpace(name)
    const item = this._instance.get(name)
    if (item) {
      const callbacks = item.listeners.get(event)
      if (callbacks) {
        // @ts-ignore
        callbacks.add(handler)
      }
    }
  }

  public off<T = FederatedPointerEvent>(name: EventNameSpace, event: string, handler: FederatedEventHandler<T>) {
    this.hasNameSpace(name)
    const item = this._instance.get(name)
    if (item) {
      const callbacks = item.listeners.get(event)
      if (callbacks) {
        // @ts-ignore
        callbacks.delete(handler)
      }
    }
  }

  public destroy() {
    this._instance.forEach((item) => this.removeListeners(item))
    this._instance.clear()
  }

  private hasNameSpace(name: EventNameSpace, enableThrow = true) {
    if (!this._instance.has(name)) {
      if (enableThrow) {
        throw new Error(`Event instance ${name} not exists`)
      }
      return false
    }
    return true
  }

  private addListeners({ listeners, target }: EventInstance) {
    listeners.forEach((callbacks, eventName) => {
      target.on?.(eventName, (event: any) => {
        callbacks.forEach((callback) => {
          callback(event)
        })
      })
    })
  }

  private removeListeners({ listeners, target }: EventInstance) {
    listeners.forEach((callbacks, eventName) => {
      target.off?.(eventName, (event: any) => {
        callbacks.forEach((callback) => {
          callback(event)
        })
      })
    })
  }

  get instance() {
    return this._instance
  }
}

export default Events
