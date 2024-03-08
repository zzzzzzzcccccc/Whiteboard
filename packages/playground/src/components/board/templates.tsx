import React from 'react'
import styled from 'styled-components'
import Template from './template'
import { Card, Flex } from 'antd'
import { useBoard } from '../../hooks'

const Wrapper = styled.div`
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
`

function Templates() {
  const { templates } = useBoard()

  return (
    <Wrapper>
      <Card size="small">
        <Flex>
          {templates.map((item, index) => (
            <Template key={item.name} index={index} item={item} />
          ))}
        </Flex>
      </Card>
    </Wrapper>
  )
}

export default Templates
