import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { AccordionPanel } from './AccordionPanel'
import { AccordionStyle } from './AccordionPanel.stories'
import { AccordionPanelContent } from './AccordionPanelContent'
import { AccordionPanelItem } from './AccordionPanelItem'
import { AccordionPanelTrigger } from './AccordionPanelTrigger'

export default {
  title: 'Data Display（データ表示）/AccordionPanel',
  component: AccordionPanel,
  subcomponents: {
    AccordionPanelItem,
    AccordionPanelContent,
    AccordionPanelTrigger,
  },
  parameters: {
    withTheming: true,
  },
}

export const VRTOpenAccordion: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      パネルを開いた状態で表示されます
    </VRTInformationPanel>
    <AccordionStyle />
  </Wrapper>
)

export const VRTAccordionFocus: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      それぞれ1番目、2番目、3番目のアイテムにフォーカスが当たった状態で表示されます
    </VRTInformationPanel>
    <AccordionStyle />
  </Wrapper>
)

export const VRTOpenAccordionNarrow: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅が狭く、パネルを開いた状態で表示されます
    </VRTInformationPanel>
    <AccordionStyle />
  </Wrapper>
)

export const VRTAccordionForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <AccordionStyle />
  </Wrapper>
)

VRTOpenAccordion.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
}

VRTAccordionFocus.parameters = {
  pseudo: {
    focusVisible: ['#left-icon-0-trigger', '#right-icon-1-trigger', '#no-icon-2-trigger'],
  },
}

VRTOpenAccordionNarrow.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}
VRTOpenAccordionNarrow.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
}

VRTAccordionForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTAccordionForcedColors.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const buttons = await canvas.findAllByRole('button')
  userEvent.click(buttons[0])
}

const Wrapper = styled.div`
  height: 100vh;
  box-sizing: border-box;
  padding: 24px;
  color: ${({ theme }) => theme.color.TEXT_BLACK};
`

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
