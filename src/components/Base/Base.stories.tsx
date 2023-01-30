import { Story } from '@storybook/react'
import React from 'react'
import styled, { css } from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { Base, LayerKeys, layerMap } from './Base'
import { DialogBase } from './DialogBase'

export default {
  title: 'Data Display（データ表示）/Base',
  component: Base,
  parameters: {
    layout: 'fullscreen',
    withTheming: true,
  },
}

export const BaseStory: Story = () => {
  const themes = useTheme()

  return (
    <DescriptionList>
      <Text as="dt" weight="bold">
        padding
      </Text>
      <dd>
        <List>
          <li>
            <Base>初期値は padding なし</Base>
          </li>
          <li>
            <Base padding={1.5}>padding props の値には余白のデザイントークンを利用できます。</Base>
          </li>
          <li>
            <Base padding={{ block: 1, inline: 1.5 }}>
              論理的プロパティに依るブロック方向とインライン方向の別指定もできます。
            </Base>
          </li>
          <li>
            <Base padding={{ block: 1 }}>いずれか一方向の利用もできます。</Base>
          </li>
        </List>
      </dd>
      <Text as="dt" weight="bold">
        color
      </Text>
      <dd>
        <List>
          <li>
            <Base>初期値</Base>
          </li>
          <li>
            <Base bgColor="BACKGROUND">bgColor: BACKGROUND</Base>
          </li>
          <li>
            <Base bgColor="BASE_GREY">bgColor: BASE_GREY</Base>
          </li>
          <li>
            <Base bgColor="OVER_BACKGROUND">bgColor: OVER_BACKGROUND</Base>
          </li>
          <li>
            <Base bgColor="HEAD">bgColor: HEAD</Base>
          </li>
          <li>
            <Base bgColor="ACTION_BACKGROUND">bgColor: ACTION_BACKGROUND</Base>
          </li>
        </List>
      </dd>
      <Text as="dt" weight="bold">
        radius
      </Text>
      <dd>
        <List>
          <li>
            <Base radius="m">
              <Text>デフォルト</Text>
            </Base>
          </li>
          <li>
            <Base radius="s">
              <Text>角丸サイズ小</Text>
            </Base>
          </li>
        </List>
      </dd>
      <Text as="dt" weight="bold">
        box-shadow
      </Text>
      <dd>
        <List>
          {Object.keys(layerMap).map((layer, index) => (
            <li key={`${layer}-${index}`}>
              <Base layer={Number(layer) as LayerKeys}>
                <Text>
                  If layer props is specified as <Text weight="bold">{layer}</Text>, box-shadow
                  becomes
                  <Text weight="bold"> {themes.shadow[layerMap[Number(layer) as LayerKeys]]}</Text>.
                </Text>
              </Base>
            </li>
          ))}
        </List>
      </dd>
    </DescriptionList>
  )
}
BaseStory.storyName = 'Base'

export const DialogBaseStory: Story = () => (
  <List>
    <li>
      <DialogBase radius="s">
        <Text>
          If radius props is specified as <Text weight="bold">s</Text>, border-radius becomes{' '}
          <Text weight="bold">6px</Text>.
        </Text>
      </DialogBase>
    </li>
    <li>
      <DialogBase radius="m">
        <Text>
          If radius props is specified as <Text weight="bold">m</Text>, border-radius becomes{' '}
          <Text weight="bold">8px</Text>.
        </Text>
      </DialogBase>
    </li>
  </List>
)
DialogBaseStory.storyName = 'DialogBase（非推奨）'

const DescriptionList = styled(Stack).attrs({ as: 'dl', gap: 1.5 })`
  ${({ theme: { color, space } }) => css`
    background-color: ${color.BACKGROUND};
    padding: ${space(1.5)};
  `}
`

const List = styled(Stack).attrs({ as: 'ul', gap: 0.75 })``
