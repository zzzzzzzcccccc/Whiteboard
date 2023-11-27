import type { Ticker } from 'pixi.js'

export interface ViewportOptions {
  screenWidth?: number
  screenHeight?: number
  resolution?: number
  ticker?: Ticker
  worldWidth: number
  worldHeight: number
}

export interface ViewportEventMapper {
  name: string
}

export interface ViewportWheelOptions {
  /** default scroll */
  action?: 'scroll' | 'zoom'
  /** default 1 */
  speed?: number
  /** default true */
  reverse?: boolean
  /** default true */
  inWorld?: boolean
}
