import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { Stack } from '../Layout'
import { Text } from '../Text'

import { Base, LayerKeys, layerMap } from './Base'
import { BaseColumn } from './BaseColumn'
import { DialogBase } from './DialogBase'

export default {
  title: 'Data Display（データ表示）/Base',
  component: Base,
}

export const BaseStory: Story = () => {
  const themes = useTheme()

  return (
    <DescriptionList>
      <dt>padding</dt>
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
      <dt>radius</dt>
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
      <dt>box-shadow</dt>
      <dd>
        <List>
          {Object.keys(layerMap).map((layer, index) => (
            <li key={`${layer}-${index}`}>
              <Base layer={Number(layer) as LayerKeys}>
                <Text>
                  If layer props is specified as <Bold>{layer}</Bold>, box-shadow becomes
                  <Bold> {themes.shadow[layerMap[Number(layer) as LayerKeys]]}</Bold>.
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

export const BaseColumnStory: Story = () => (
  <Stack as="ul">
    <li>
      <p>padding / bgColor で余白と背景色を変えることもできます</p>
    </li>
    <li>
      <BaseColumn>初期状態。padding は1文字分。背景は COLUMN。</BaseColumn>
    </li>
    <li>
      <BaseColumn padding={1.5} bgColor="ACTION_BACKGROUND">
        padding を1.5文字分に、背景を ACTION_BACKGROUND に変更。
      </BaseColumn>
    </li>
  </Stack>
)
BaseColumnStory.storyName = 'BaseColumn'

export const DialogBaseStory: Story = () => (
  <List>
    <li>
      <DialogBase radius="s">
        <Text>
          If radius props is specified as <Bold>s</Bold>, border-radius becomes <Bold>6px</Bold>.
        </Text>
      </DialogBase>
    </li>
    <li>
      <DialogBase radius="m">
        <Text>
          If radius props is specified as <Bold>m</Bold>, border-radius becomes <Bold>8px</Bold>.
        </Text>
      </DialogBase>
    </li>
  </List>
)
DialogBaseStory.storyName = 'DialogBase（非推奨）'

const DescriptionList = styled.dl`
  padding: 24px;
  background-color: #eee;
`

const List = styled.ul`
  margin: 0;
  padding: 24px;
  background-color: #eee;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 24px;
  }
`

const Bold = styled.span`
  font-weight: bold;
`
