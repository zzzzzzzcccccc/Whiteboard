import { Plugin } from './plugins'

class PluginManager {
  private readonly _plugins = new Map<string, Plugin>()

  public add(name: string, target: Plugin) {
    this._plugins.set(name, target)
  }

  public remove(name: string) {
    this._plugins.delete(name)
  }

  public get(name: string): Plugin | undefined {
    return this._plugins.get(name)
  }

  public destroy() {
    this._plugins.clear()
  }

  public resize() {
    this._plugins.forEach((plugin) => {
      plugin.resize()
    })
  }

  public update() {
    this._plugins.forEach((plugin) => {
      plugin.update()
    })
  }
}

export default PluginManager
