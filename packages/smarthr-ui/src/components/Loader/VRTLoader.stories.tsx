import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { Loader } from './Loader'
import { All } from './Loader.stories'

export default {
  title: 'States（状態）/Loader',
  component: Loader,
  parameters: {
    withTheming: true,
  },
}

export const VRTLoaderForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTLoaderForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
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
