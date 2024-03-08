import React, { useState, useCallback } from 'react'
import { IIBoardContext, BoardProviderProps } from './types'
import { NOT_FOUND_BOARD_CONTEXT, DEFAULT_TEMPLATES } from '../../constant'

const initialContext: IIBoardContext = {
  sdk: new Error(NOT_FOUND_BOARD_CONTEXT),
  zoom: 1,
  templates: DEFAULT_TEMPLATES,
  updateZoom: () => new Error(NOT_FOUND_BOARD_CONTEXT),
  updateTemplates: () => new Error(NOT_FOUND_BOARD_CONTEXT),
}

export const BoardContext = React.createContext(initialContext)

function BoardProvider(props: BoardProviderProps) {
  const { children, sdk } = props

  const [zoom, setZoom] = useState(initialContext.zoom)
  const [templates, setTemplates] = useState(initialContext.templates)

  const updateZoom = useCallback((payload: IIBoardContext['zoom']) => {
    setZoom(payload)
  }, [])

  const updateTemplates = useCallback((payload: IIBoardContext['templates']) => {
    setTemplates(payload)
  }, [])

  const context = {
    sdk,
    zoom,
    templates,
    updateZoom,
    updateTemplates,
  }

  return <BoardContext.Provider value={context}>{children}</BoardContext.Provider>
}

export default BoardProvider
