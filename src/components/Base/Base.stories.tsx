import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { useTheme } from '../../hooks/useTheme'
import { Table, Td, Th } from '../Table'
import { Text } from '../Text'

import { Base, LayerKeys, layerMap } from './Base'
import { DialogBase } from './DialogBase'

export default {
  title: 'Data Display（データ表示）/Base',
  component: Base,
}

export const BaseStory: StoryFn = () => {
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
      <dt>overflow</dt>
      <dd>
        <List>
          <li>
            <Base overflow="hidden">
              <Table>
                <thead>
                  <tr>
                    <Th>説明</Th>
                    <Th>補足</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>必要に応じて overflow を使い溢れたコンテンツを処理できます。</Td>
                    <Td>
                      <code>overflow=&#123;&#123; x, y &#125;&#125;</code> の形でも書けます。
                    </Td>
                  </tr>
                </tbody>
              </Table>
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

export const DialogBaseStory: StoryFn = () => (
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
