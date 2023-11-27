import Viewport from '../viewport'

class Plugin<Options = any> {
  public readonly _viewport: Viewport

  public _options: Options | null = null

  constructor(viewport: Viewport, options?: Options) {
    this._viewport = viewport
    if (options) {
      this.options = options
    }
  }

  public run() {
    // implement in subclass
  }

  public resize() {
    // implement in subclass
  }

  public update() {
    // implement in subclass
  }

  get options(): Options | null {
    return this._options || null
  }

  set options(value: Options) {
    if (value) {
      this._options = { ...this._options, ...value }
    }
  }
}

export default Plugin
