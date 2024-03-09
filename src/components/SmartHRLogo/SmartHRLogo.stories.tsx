import { Story } from '@storybook/react'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Text } from '../Text'

import { SmartHRLogo } from './SmartHRLogo'

export default {
  title: 'Media（メディア）/SmartHRLogo',
  component: SmartHRLogo,
  parameters: {
    withTheming: true,
  },
}

export const All: Story = () => (
  <List>
    <li>
      <LogoWrapper>
        <SmartHRLogo />
      </LogoWrapper>
    </li>
    <li>
      <Text as="p">
        alt や色、大きさを指定できます。
        <br />
        width は height より優先されます。
      </Text>
      <LogoWrapper className="white">
        <SmartHRLogo alt="株式会社SmartHR（スマートHR）" fill="brand" />
      </LogoWrapper>
      <LogoWrapper className="white">
        <SmartHRLogo alt="株式会社SmartHR（スマートHR）" fill="black" width="20em" />
      </LogoWrapper>
    </li>
  </List>
)
All.storyName = 'all'

const List = styled.ul`
  padding: 0;

  li {
    display: inline-block;
  }

  li + li {
    margin-inline-start: 16px;
  }
`
const LogoWrapper = styled.div`
  ${({ theme: { color } }) => css`
    display: inline-block;
    background-color: ${color.BRAND};

    &.white {
      background-color: ${color.WHITE};
    }
  `}
`
