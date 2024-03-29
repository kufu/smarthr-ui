import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { fireEvent, within } from '@storybook/test'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { TabBar } from './TabBar'
import { All } from './TabBar.stories'
import { TabItem } from './TabItem'

export default {
  title: 'Navigation（ナビゲーション）/TabBar',
  component: TabBar,
  parameters: {
    withTheming: true,
  },
}

export const VRTHover: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hoverの状態で表示されます
    </VRTInformationPanel>
    <Ul>
      <li>
        <TabBar id="hover">
          <TabItem id="border-1" onClick={action('clicked')}>
            Tab
          </TabItem>
          <TabItem id="border-2" onClick={action('clicked')} selected>
            Selected
          </TabItem>
          <TabItem id="border-3" onClick={action('clicked')} disabled>
            Disabled
          </TabItem>
        </TabBar>
      </li>
    </Ul>
  </>
)
VRTHover.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['#hover button'],
  },
}

export const VRTUserFocus: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      ユーザー操作のfocusをシミュレートした状態で表示されます
    </VRTInformationPanel>
    <Ul>
      <li>
        <TabBar>
          <TabItem id="border-1" onClick={action('clicked')}>
            Tab
          </TabItem>
          <TabItem id="border-2" onClick={action('clicked')} selected>
            Selected
          </TabItem>
          <TabItem id="border-3" onClick={action('clicked')} disabled>
            Disabled
          </TabItem>
        </TabBar>
      </li>
    </Ul>
  </>
)
VRTUserFocus.play = async ({ canvasElement }) => {
  const canvas = await within(canvasElement)
  const tabs = await canvas.getAllByRole('tab')
  // fireEvent.focusでは内部的にdispatchEventメソッドを使用し、バインドされたハンドラのみのトリガーとなり、イベントを受け取った要素のUI（ブラウザ）の動作はトリガーされない
  tabs[0].focus()
}

export const VRTScroll: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭い状態でスクロールされるか確認します
    </VRTInformationPanel>
    <Ul>
      <li>
        <TabBar>
          <TabItem id="border-1" onClick={action('clicked')}>
            Tab1
          </TabItem>
          <TabItem id="border-2" onClick={action('clicked')}>
            Tab2
          </TabItem>
          <TabItem id="border-3" onClick={action('clicked')}>
            Tab3
          </TabItem>
          <TabItem id="border-4" onClick={action('clicked')}>
            Tab4
          </TabItem>
          <TabItem id="border-5" onClick={action('clicked')}>
            Tab5
          </TabItem>
          <TabItem id="border-6" onClick={action('clicked')}>
            Tab6
          </TabItem>
        </TabBar>
      </li>
    </Ul>
  </>
)
VRTScroll.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}
VRTScroll.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  // nav要素の直下のdiv要素がスクロールする要素
  const scrollableElement = await canvas.findByRole('tablist')
  await fireEvent.scroll(scrollableElement, { target: { scrollLeft: 1000 } })
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`

const Ul = styled.ul`
  padding: 0 1rem;

  li {
    margin-bottom: 1rem;
    list-style: none;
  }
`
