import React from 'react'
import { InitializeProvider } from './context'
import { Router } from './components'

export default function App() {
  return (
    <InitializeProvider>
      <Router />
    </InitializeProvider>
  )
}
