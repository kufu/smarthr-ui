import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { boxShadow } from '../../themes'
import { Heading } from '../Heading'
import { Section } from '../SectioningContent'
import { Table, Td, Th } from '../Table'
import { Text } from '../Text'

import { Base } from './Base'

export type LayerKeys = keyof typeof LayerMap

export const LayerMap = {
  0: 'layer-0',
  1: 'layer-1',
  2: 'layer-2',
  3: 'layer-3',
  4: 'layer-4',
} as const

export default {
  title: 'Data Display（データ表示）/Base',
  component: Base,
}

export const BaseStory: StoryFn = () => (
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
        {Object.keys(LayerMap).map((layer, index) => (
          <li key={`${layer}-${index}`}>
            <Base layer={Number(layer) as LayerKeys}>
              <Text>
                If layer props is specified as <Bold>{layer}</Bold>, box-shadow becomes
                <Bold> {boxShadow[LayerMap[Number(layer) as LayerKeys]]}</Bold>.
              </Text>
            </Base>
          </li>
        ))}
      </List>
    </dd>
    <dt>SectioningContentをasに指定した場合の見出しレベル自動計算</dt>
    <dd>
      <List>
        <li>
          <Section>
            <Heading>親見出し</Heading>
            <Base as="section">
              {/* FIXME: Baseに対するチェックは eslint-plugin-smarthr@v0.5.9以降で修正されるため下記コメントは削除する */}
              {/* eslint-disable-next-line smarthr/a11y-heading-in-sectioning-content */}
              <Heading>子見出し</Heading>
            </Base>
          </Section>
        </li>
      </List>
    </dd>
  </DescriptionList>
)
BaseStory.storyName = 'Base'

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
