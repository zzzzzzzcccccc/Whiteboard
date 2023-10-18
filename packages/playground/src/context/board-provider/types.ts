import React from 'react'
import Sdk from '@yyz/sdk'

export interface IIBoardContext {
  sdk: Sdk
}

export interface BoardProviderProps {
  children?: React.ReactNode
  context: IIBoardContext
}
