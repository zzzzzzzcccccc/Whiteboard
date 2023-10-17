import React from 'react'
import ReactDom from 'react-dom/client'
import App from './app'

const root = document.getElementById('root')

if (root) {
  ReactDom.createRoot(root).render(<App />)
}
