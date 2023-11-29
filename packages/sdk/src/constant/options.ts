import { Ticker } from 'pixi.js'

export const DEFAULT_SCREEN_OPTIONS = {
  backgroundColor: '#f9f9f9',
  resizeTo: window,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
}

export const DEFAULT_WHITEBOARD_OPTIONS = {
  width: 5000,
  height: 5000,
  backgroundColor: '#ffffff',
  wheelSpeed: 0.5,
  zoom: 1,
  zoomLimit: [0.5, 4.1],
}

export const DEFAULT_DOT_OPTIONS = {
  hidden: false,
  radius: 0.5,
  color: '#CECECE',
  gap: 10,
}

export const DEFAULT_SCROLLBAR_OPTIONS = {
  backgroundColor: '#7D7D7D',
  size: 4,
  zIndex: 10,
  radius: 2,
  hiddenDelay: 5000,
}

export const DEFAULT_VIEWPORT_OPTIONS = {
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  resolution: window.devicePixelRatio || 1,
  ticker: Ticker.shared,
}
