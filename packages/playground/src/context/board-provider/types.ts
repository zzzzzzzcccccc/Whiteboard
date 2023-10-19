import React from 'react'
import Sdk from '@yyz/sdk'

export interface IIBoardContext {
  sdk: Sdk
  zoom: number
  updateZoom: (zoom: number) => void
}

export interface BoardProviderProps {
  children?: React.ReactNode
  sdk: Sdk
}
