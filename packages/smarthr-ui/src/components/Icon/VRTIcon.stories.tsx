import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import * as Icons from './Icon'
import { All, Color } from './Icon.stories'

const { FaAddressCardIcon } = Icons

export default {
  title: 'Media（メディア）/Icon',
  component: FaAddressCardIcon,
  parameters: {
    withTheming: true,
  },
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <Title>Color</Title>
    <VRTColorWrapper>
      <Color />
    </VRTColorWrapper>
    <Title>All</Title>
    <All />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
const Title = styled.p`
  margin: 0 0 16px;
`
const VRTColorWrapper = styled.div`
  padding: 0 16px 16px 0;
`
