import EventEmitter from 'events'
import { EmitterEventName } from '../enums'

class Emitter {
  private readonly _emitter: EventEmitter

  constructor() {
    this._emitter = new EventEmitter()
  }

  public emit<T>(name: EmitterEventName, ...args: T[]) {
    this._emitter.emit(name, ...args)
  }

  public on<T>(name: EmitterEventName, callback: (...args: T[]) => void) {
    this._emitter.on(name, callback)
  }

  public off<T>(name: EmitterEventName, callback: (...args: T[]) => void) {
    this._emitter.off(name, callback)
  }

  public removeAllListeners() {
    this._emitter.removeAllListeners()
  }
}

export default Emitter
