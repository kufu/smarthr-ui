import * as React from 'react'
import styled, { css } from 'styled-components'
import { Story } from '@storybook/react'

import readme from './README.md'

import { SmartHRLogo } from './SmartHRLogo'
import { Text } from '../Text'

export default {
  title: 'SmartHRLogo',
  component: SmartHRLogo,
  parameters: {
    readme: {
      sidebar: readme,
    },
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
        title や色、大きさを指定できます。
        <br />
        デザインシステムに則って[アイソレーション](https://smarthr.design/basics/logos/#h3-1)を設けています。
      </Text>
      <LogoWrapper className="white">
        <SmartHRLogo title="株式会社SmartHR（スマートHR）" fill="brand" height="1.5em" />
      </LogoWrapper>
      <LogoWrapper className="white">
        <SmartHRLogo title="株式会社SmartHR（スマートHR）" fill="black" width="10em" />
      </LogoWrapper>
    </li>
  </List>
)
All.storyName = 'all'

const List = styled.ul`
  margin: 0;
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
