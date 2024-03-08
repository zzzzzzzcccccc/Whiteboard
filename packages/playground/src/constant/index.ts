import { Template } from '../context/board-provider/types'
import { BlockName } from '@yyz/blocks'

export const DEFAULT_PRIMARY_COLOR = '#D81B60'
export const DEFAULT_ANTD_COMPONENT_SIZE = 'middle'
export const DEFAULT_INITIALIZE_STATUS = 'PENDING'
export const SUCCESS_INITIALIZE_STATUS = 'SUCCESS'
export const NOT_FOUND_INITIALIZE_CONTEXT = 'Please use InitializeProvider'

export const NOT_FOUND_BOARD_CONTEXT = 'BoardProvider not initialized'

export const DEFAULT_TEMPLATES: Template[] = [
  {
    displayName: 'sticky_note',
    name: BlockName.StickyNote,
    icon: 'icon-sticky-note',
  },
]
