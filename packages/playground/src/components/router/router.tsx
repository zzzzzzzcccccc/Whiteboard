import React from 'react'
import { Router as RootRouter, Routes, Route } from 'react-router-dom'
import { useInitialize } from '../../hooks'
import { history } from '../../config'
import Layout from '../layout'

function Router() {
  const { update } = useInitialize()

  return (
    <RootRouter location={update.location} navigator={history} navigationType={update.action}>
      <Routes>
        <Route path="/" element={<Layout />} />
      </Routes>
    </RootRouter>
  )
}

export default Router
