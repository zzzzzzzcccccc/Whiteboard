import React from 'react'
import styled from 'styled-components'
import { useBoard } from '../../hooks'

const Wrapper = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
`

function Tools() {
  const { sdk } = useBoard()
  console.log(sdk)
  return <Wrapper>tools</Wrapper>
}

export default Tools
