import React from 'react'
import { ThemeConfig } from 'antd'
import { KeyCode } from '../../utils'
import { Update } from 'history'

export interface IInitializeContext {
  status: 'PENDING' | 'SUCCESS' | 'FAILURE'
  update: Update
  theme: ThemeConfig & { antdComponentSize?: 'large' | 'middle' | 'small' }
  language: string
  updateTheme: (target: Partial<IInitializeContext['theme']>) => void
  updateLanguage: (target: IInitializeContext['language']) => void
  onResize: (cb: () => void) => () => void
  offResize: (cb: () => void) => void
  onKeyboard: (cb: (keyCode: KeyCode, event: KeyboardEvent) => void) => () => void
  offKeyboard: (cb: (keyCode: KeyCode, event: KeyboardEvent) => void) => void
  onRouterChange: (cb: (update: Update) => void) => () => void
  offRouterChange: (cb: (update: Update) => void) => void
}

export interface InitializeProviderProps {
  children?: React.ReactNode
}
