import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { DropZone } from './DropZone'
import { Theme, useTheme } from '../../hooks/useTheme'
import readme from './README.md'

const onSelectFiles = action('onSelectFiles')

storiesOf('DropZone', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const theme = useTheme()

    return (
      <Group>
        <li>
          <Text>Default</Text>
          <DropZone onSelectFiles={onSelectFiles} />
        </li>

        <li>
          <Text>With children</Text>
          <DropZone onSelectFiles={onSelectFiles}>
            <DropZoneText theme={theme}>
              <span>ここにドラッグ&ドロップ</span>
              <span>または</span>
            </DropZoneText>
          </DropZone>
        </li>

        <li>
          <Text>Button accepting only image files</Text>
          <DropZone onSelectFiles={onSelectFiles} accept="image/*">
            <DropZoneText theme={theme}>
              <span>ここにドラッグ&ドロップ</span>
              <span>または</span>
            </DropZoneText>
          </DropZone>
        </li>
      </Group>
    )
  })

const Group = styled.ul`
  list-style: none;
  padding: 24px;
  & > li:not(:first-child) {
    margin-top: 24px;
  }
`

const Text = styled.p`
  margin: 0 0 16px 0;
  font-size: 16px;
`

const DropZoneText = styled.p<{ theme: Theme }>`
  ${({ theme }) => {
    const { palette } = theme
    return css`
      margin: 0;
      span {
        display: block;
        margin: 0 0 16px;
        text-align: center;
        font-size: 14px;
        line-height: 1;
        color: ${palette.TEXT_GREY};
      }
    `
  }}
`
