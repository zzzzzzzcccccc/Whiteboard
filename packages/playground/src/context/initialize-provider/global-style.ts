import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ui-monospace, Menlo, Monaco, 'Cascadia Mono',
      'Segoe UI Mono', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace',
      'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    display: flex;
  }
`

export default GlobalStyle
