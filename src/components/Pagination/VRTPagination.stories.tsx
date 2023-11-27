import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { fireEvent, within } from '@storybook/testing-library'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Pagination } from './Pagination'
import { All } from './Pagination.stories'

export default {
  title: 'Navigation（ナビゲーション）/Pagination',
  component: Pagination,
  parameters: {
    withTheming: true,
  },
}

export const VRTState: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <List>
      <li id="hover">
        <Txt>hover</Txt>
        <Pagination current={1} total={5} onClick={action('click!!')} />
      </li>
      <li id="focus">
        <Txt>focus</Txt>
        <Pagination current={1} total={5} onClick={action('click!!')} />
      </li>
      <li id="focus-visible">
        <Txt>focusVisible</Txt>
        <Pagination current={1} total={5} onClick={action('click!!')} />
      </li>
      <li id="active">
        <Txt>active</Txt>
        <Pagination current={1} total={5} onClick={action('click!!')} />
      </li>
    </List>
  </>
)
VRTState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['#hover button'],
    focus: ['#focus button'],
    focusVisible: ['#focus-visible button'],
    active: ['#active button'],
  },
}

export const VRTScroll: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭い状態でスクロールされるか確認します
    </VRTInformationPanel>
    <Pagination current={7} total={13} onClick={action('click!!')} />
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
  const scrollableElement = (await canvas.findByRole('navigation')).firstElementChild!
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

const List = styled.ul`
  padding: 0 20px;

  & > li {
    list-style: none;

    &:not(:first-child) {
      margin-top: 20px;
    }
  }
`
const Txt = styled.p`
  margin: 0 0 10px;
`
