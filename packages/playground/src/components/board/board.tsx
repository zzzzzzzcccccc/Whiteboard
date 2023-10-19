import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { BoardProvider } from '../../context'
import { Sdk } from '@yyz/sdk'
import ToolBar from './tool-bar'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
`

const Target = styled.div`
  width: 100%;
  height: 100%;
`

function Board() {
  const [loading, setLoading] = useState(true)

  const targetRef = useRef<HTMLDivElement | null>(null)
  const sdkRef = useRef<Sdk | null>(null)

  useEffect(() => {
    if (!targetRef.current) return

    sdkRef.current = new Sdk(targetRef.current!)
    sdkRef.current!.render()

    setLoading(false)

    return () => {
      sdkRef.current!.destroy()
      sdkRef.current = null
    }
  }, [])

  return (
    <BoardProvider sdk={sdkRef.current}>
      <Wrapper>
        <Target ref={targetRef} />
        {!loading && (
          <>
            <ToolBar />
          </>
        )}
      </Wrapper>
    </BoardProvider>
  )
}

export default Board
