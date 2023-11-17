import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { StatusLabel } from './StatusLabel'
import { All } from './StatusLabel.stories'

export default {
  title: 'States（状態）/StatusLabel',
  component: StatusLabel,
  parameters: {
    withTheming: true,
  },
}

export const VRTStatusLabelForcedColors: StoryFn = () => (
  <Wrapper>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </Wrapper>
)

VRTStatusLabelForcedColors.parameters = {
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
