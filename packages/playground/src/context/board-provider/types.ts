import React from 'react'
import Sdk from '@yyz/sdk'
import { BlockName } from '@yyz/blocks'

export interface Template {
  displayName: string
  name: BlockName
  icon: string
}

export interface IIBoardContext {
  sdk: Sdk
  zoom: number
  templates: Template[]
  updateZoom: (zoom: number) => void
  updateTemplates: (templates: Template[]) => void
}

export interface BoardProviderProps {
  children?: React.ReactNode
  sdk: Sdk
}
