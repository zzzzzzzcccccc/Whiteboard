import React from 'react'
import { IIBoardContext, BoardProviderProps } from './types'

const initialContext: IIBoardContext = {
  sdk: new Error('BoardProvider not initialized'),
}

export const BoardContext = React.createContext(initialContext)

function BoardProvider(props: BoardProviderProps) {
  const { children, context } = props
  return <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
}

export default BoardProvider
