import React from 'react'
import styled from 'styled-components'
import { Tooltip } from 'antd'
import { TemplateProps } from './types'
import CustomIcon from '../custom-icon'
import { useTranslate } from '../../hooks'

const Wrapper = styled.div`
  cursor: pointer;
`

function Template(props: TemplateProps) {
  const { item } = props
  const { icon, displayName } = item
  const t = useTranslate()

  return (
    <Tooltip title={t(displayName)}>
      <Wrapper>
        <CustomIcon type={icon} />
      </Wrapper>
    </Tooltip>
  )
}

export default Template
