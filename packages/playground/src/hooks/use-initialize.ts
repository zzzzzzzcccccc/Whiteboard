import { useContext } from 'react'
import { InitializeContext, IInitializeContext } from '../context'

export default function useInitialize(): IInitializeContext {
  return useContext(InitializeContext)
}
