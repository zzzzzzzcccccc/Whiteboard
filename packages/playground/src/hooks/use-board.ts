import { useContext } from 'react'
import { BoardContext, IIBoardContext } from '../context'

export default function useBoard(): IIBoardContext {
  return useContext(BoardContext)
}
