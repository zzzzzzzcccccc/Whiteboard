import React, { useState, useCallback } from 'react'
import { IIBoardContext, BoardProviderProps } from './types'

const initialContext: IIBoardContext = {
  sdk: new Error('BoardProvider not initialized'),
  zoom: 1,
  updateZoom: () => new Error('BoardProvider not initialized'),
}

export const BoardContext = React.createContext(initialContext)

function BoardProvider(props: BoardProviderProps) {
  const { children, sdk } = props

  const [zoom, setZoom] = useState(initialContext.zoom)

  const updateZoom = useCallback((payload: IIBoardContext['zoom']) => {
    setZoom(payload)
  }, [])

  const context = {
    sdk,
    zoom,
    setZoom,
    updateZoom,
  }

  return <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
}

export default BoardProvider
