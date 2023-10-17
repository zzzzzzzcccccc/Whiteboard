import React from 'react'
import styled from 'styled-components'
import Board from '../board'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

function Layout() {
  return (
    <Wrapper>
      <Board />
    </Wrapper>
  )
}

export default Layout
