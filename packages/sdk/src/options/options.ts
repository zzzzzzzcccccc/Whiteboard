import {
  DEFAULT_SCREEN_OPTIONS,
  DEFAULT_WHITEBOARD_OPTIONS,
  DEFAULT_DOT_OPTIONS,
  DEFAULT_SCROLL_BAR_OPTIONS,
} from '../constant'

class Options {
  private _screen = DEFAULT_SCREEN_OPTIONS
  private _whiteboard = DEFAULT_WHITEBOARD_OPTIONS
  private _dot = DEFAULT_DOT_OPTIONS
  private _scrollBar = DEFAULT_SCROLL_BAR_OPTIONS

  /**
   * @types {@link Options.screen}
   * @description screen options
   */
  get screen(): typeof DEFAULT_SCREEN_OPTIONS {
    return this._screen
  }

  set screen(payload: Partial<typeof DEFAULT_SCREEN_OPTIONS>) {
    this._screen = { ...payload, ...this._screen }
  }

  /**
   * @types {@link Options.whiteboard}
   * @description whiteboard options
   */
  get whiteboard(): typeof DEFAULT_WHITEBOARD_OPTIONS {
    return this._whiteboard
  }

  set whiteboard(payload: Partial<typeof DEFAULT_WHITEBOARD_OPTIONS>) {
    this._whiteboard = { ...payload, ...this._whiteboard }
  }

  /**
   * @types {@link Options.dot}
   * @description dot options
   */
  get dot(): typeof DEFAULT_DOT_OPTIONS {
    return this._dot
  }

  set dot(payload: Partial<typeof DEFAULT_DOT_OPTIONS>) {
    this._dot = { ...payload, ...this._dot }
  }

  /**
   * @types {@link Options.scrollBar}
   * @description scroll bar options
   */
  get scrollBar(): typeof DEFAULT_SCROLL_BAR_OPTIONS {
    return this._scrollBar
  }

  set scrollBar(payload: Partial<typeof DEFAULT_SCROLL_BAR_OPTIONS>) {
    this._scrollBar = { ...payload, ...this._scrollBar }
  }
}

export default Options
