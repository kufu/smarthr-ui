import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { DropZone } from './DropZone'

export default {
  title: 'DropZone',
  component: DropZone,
  parameters: {
    withTheming: true,
  },
}

const onSelectFiles = action('onSelectFiles')

export const All: Story = () => {
  return (
    <Group>
      <li>
        <Text>Default</Text>
        <DropZone onSelectFiles={onSelectFiles} />
      </li>

      <li>
        <Text>With children</Text>
        <DropZone onSelectFiles={onSelectFiles}>
          <DropZoneText>
            <span>ここにドラッグ&ドロップ</span>
            <span>または</span>
          </DropZoneText>
        </DropZone>
      </li>

      <li>
        <Text>Button accepting only image files</Text>
        <DropZone onSelectFiles={onSelectFiles} accept="image/*">
          <DropZoneText>
            <span>ここにドラッグ&ドロップ</span>
            <span>または</span>
          </DropZoneText>
        </DropZone>
      </li>

      <li>
        <Text>単一ファイルは任意（デフォルト複数選択可）</Text>
        <DropZone onSelectFiles={onSelectFiles} multiple={false} />
      </li>
    </Group>
  )
}
All.storyName = 'all'

const Group = styled.ul`
  list-style: none;
  padding: 24px;
  & > li:not(:first-child) {
    margin-top: 24px;
  }
`

const Text = styled.p`
  margin: 0 0 16px;
`

const DropZoneText = styled.p(
  ({ theme: { palette } }) =>
    css`
      margin: 0;
      span {
        display: block;
        margin: 0 0 16px;
        text-align: center;
        line-height: 1;
        color: ${palette.TEXT_GREY};
      }
    `,
)
