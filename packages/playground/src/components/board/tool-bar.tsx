import React from 'react'
import styled from 'styled-components'
import { Card, Button, Flex } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useBoard } from '../../hooks'
import { options } from '@yyz/sdk'

const Wrapper = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
`

function ToolBar() {
  const { sdk, zoom, updateZoom } = useBoard()

  const handleOnZoomChange = (target: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    const { zoomLimit } = options.whiteboard
    const [min, max] = zoomLimit
    event.stopPropagation()
    if (target < min || target > max) return
    updateZoom(target)
    sdk.app.updateWhiteboardZoom(target)
  }

  return (
    <Wrapper>
      <Card size="small">
        <Flex align="center" justify="center">
          <Flex align="center" justify="center">
            <Button type="text" icon={<PlusOutlined />} onClick={handleOnZoomChange(zoom + 0.1)} />
            <Button type="text" onClick={handleOnZoomChange(1)} style={{ width: 70 }}>{`${Math.floor(
              zoom * 100,
            )}%`}</Button>
            <Button type="text" icon={<MinusOutlined />} onClick={handleOnZoomChange(zoom - 0.1)} />
          </Flex>
        </Flex>
      </Card>
    </Wrapper>
  )
}

export default ToolBar
