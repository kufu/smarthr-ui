import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Table } from './Table'
import { All, WithReel } from './Table.stories'

export default {
  title: 'Data Display（データ表示）/Table',
  component: Table,
  parameters: {
    withTheming: true,
  },
}

export const VRTNarrowTablet: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅がタブレットを想定した幅の状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTNarrowTablet.parameters = {
  viewport: {
    defaultViewport: 'vrtTablet',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtTablet' },
    },
  },
}

export const VRTNarrowMobile: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅がモバイルを想定した幅の状態で表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTNarrowMobile.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
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

export const VRTWithReelNarrowTablet: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅がタブレットを想定した幅の状態で表示されます
    </VRTInformationPanel>
    <WithReel />
  </>
)
VRTWithReelNarrowTablet.parameters = {
  viewport: {
    defaultViewport: 'vrtTablet',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtTablet' },
    },
  },
}

export const VRTWithReelNarrowMobile: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      画面幅がモバイルを想定した幅の状態で表示されます
    </VRTInformationPanel>
    <WithReel />
  </>
)
VRTWithReelNarrowMobile.parameters = {
  viewport: {
    defaultViewport: 'vrtMobile',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtMobile' },
    },
  },
}

export const VRTWithReelForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <WithReel />
  </>
)
VRTWithReelForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}
VRTWithReelForcedColors.parameters = {
  viewport: {
    defaultViewport: 'vrtTablet',
  },
  chromatic: {
    modes: {
      vrtMobile: { viewport: 'vrtTablet' },
    },
  },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
