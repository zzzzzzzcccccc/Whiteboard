import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Sdk } from '@yyz/sdk'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`

function Board() {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const sdkRef = useRef<Sdk | null>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    sdkRef.current = new Sdk(wrapperRef.current!)
    sdkRef.current!.render()

    return () => {
      sdkRef.current!.destroy()
      sdkRef.current = null
    }
  }, [])

  return <Wrapper ref={wrapperRef} />
}

export default Board
