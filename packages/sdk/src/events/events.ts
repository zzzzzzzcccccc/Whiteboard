import EventEmitter from 'events'
import { EmitterEventName } from '../enums'

class Events {
  private readonly _emitter: EventEmitter
  private readonly _instance = new Map<EmitterEventName, Set<(payload: any) => void>>()

  constructor() {
    this._emitter = new EventEmitter()
    this.initialize()
  }

  public emitResizeChange(event: UIEvent) {
    this._emitter.emit(EmitterEventName.RESIZE_CHANGE, { event })
  }

  public on<P>(name: EmitterEventName, listener: (payload: P) => void) {
    if (!this._instance.has(name)) {
      this._instance.set(name, new Set())
    }
    this._instance.get(name)?.add(listener)
  }

  public removeAllListeners() {
    this._instance.clear()
    this._emitter.removeAllListeners()
  }

  private initialize() {
    // @ts-ignore
    const events = Object.values(EmitterEventName) as EmitterEventName[]
    events.forEach((name) => {
      this._emitter.on(name, (payload) => {
        const listeners = this._instance.get(name)
        listeners?.forEach((listener) => {
          listener(payload)
        })
      })
    })
  }
}

export default Events
