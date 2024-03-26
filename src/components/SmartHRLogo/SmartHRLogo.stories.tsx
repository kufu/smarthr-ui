import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Cluster } from '../Layout'
import { Text } from '../Text'

import { SmartHRLogo } from './SmartHRLogo'

export default {
  title: 'Media（メディア）/SmartHRLogo',
  component: SmartHRLogo,
  parameters: {
    withTheming: true,
  },
}

export const All: StoryFn = () => (
  <>
    <Text as="p">
      alt や色、大きさを指定できます。
      <br />
      width は height より優先されます。
    </Text>
    <Cluster as="ul" gap={1} align="end" className="shr-list-none">
      <li>
        <LogoWrapper>
          <SmartHRLogo />
        </LogoWrapper>
      </li>
      <li>
        <LogoWrapper className="white">
          <SmartHRLogo alt="株式会社SmartHR（スマートHR）" fill="brand" />
        </LogoWrapper>
      </li>
      <li>
        <LogoWrapper className="white">
          <SmartHRLogo alt="株式会社SmartHR（スマートHR）" fill="black" width="20em" />
        </LogoWrapper>
      </li>
    </Cluster>
  </>
)
All.storyName = 'all'

const LogoWrapper = styled.div`
  ${({ theme: { color } }) => css`
    display: inline-block;
    background-color: ${color.BRAND};

    &.white {
      background-color: ${color.WHITE};
    }
  `}
`
