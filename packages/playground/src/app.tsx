import React from 'react'
import styled from 'styled-components'
import './app.less'

const Container = styled.div`
  display: grid;
`

export default function App() {
  return(
    <Container className="app">App</Container>
  )
}
