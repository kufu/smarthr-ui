import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { useTheme } from '../../hooks/useTheme'

import { Base, LayerKeys, layerMap } from './Base'
import { DialogBase } from './DialogBase'

export default {
  title: 'Base',
  component: Base,
}

export const BaseStory: Story = () => {
  const themes = useTheme()

  return (
    <List>
      <dt>radius</dt>
      <dd>
        <List>
          <li>
            <Base radius="m">
              <Txt>デフォルト</Txt>
            </Base>
          </li>
          <li>
            <Base radius="s">
              <Txt>角丸サイズ小</Txt>
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
                <Txt>
                  If layer props is specified as <Bold>{layer}</Bold>, box-shadow becomes
                  <Bold> {themes.shadow[layerMap[Number(layer) as LayerKeys]]}</Bold>.
                </Txt>
              </Base>
            </li>
          ))}
        </List>
      </dd>
    </List>
  )
}
BaseStory.storyName = 'Base'

export const DialogBaseStory: Story = () => (
  <List>
    <li>
      <DialogBase radius="s">
        <Txt>
          If radius props is specified as <Bold>s</Bold>, border-radius becomes <Bold>6px</Bold>.
        </Txt>
      </DialogBase>
    </li>
    <li>
      <DialogBase radius="m">
        <Txt>
          If radius props is specified as <Bold>m</Bold>, border-radius becomes <Bold>8px</Bold>.
        </Txt>
      </DialogBase>
    </li>
  </List>
)
DialogBaseStory.storyName = 'DialogBase'

const List = styled.ul`
  margin: 0;
  padding: 24px;
  background-color: #eee;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 24px;
  }
`
const Txt = styled.p`
  margin: 0;
  padding: 24px;
`
const Bold = styled.span`
  font-weight: bold;
`
