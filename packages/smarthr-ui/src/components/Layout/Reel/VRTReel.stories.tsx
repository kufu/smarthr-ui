import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { Reel } from '../../..'
import { InformationPanel } from '../../InformationPanel'

import { All } from './Reel.stories'

export default {
  title: 'Layouts（レイアウト）/Reel',
  component: Reel,
  parameters: {
    withTheming: true,
  },
}

export const VRTReelForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTReelForcedColors.parameters = {
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
