import * as React from 'react'
import styled, { css } from 'styled-components'
import { Story } from '@storybook/react'

import readme from './README.md'

import { SmartHRLogo } from './SmartHRLogo'
import { useTheme } from '../../hooks/useTheme'

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
      <Text>default</Text>
      <LogoWrapper>
        <SmartHRLogo />
      </LogoWrapper>
    </li>
    <li>
      <Text>You can set title and select fill color</Text>
      <LogoWrapper className="white">
        <SmartHRLogo title="custom title" fill="brand" />
      </LogoWrapper>
    </li>
    <li>
      <Text>You can set custom width and height</Text>
      <LogoWrapper>
        <SmartHRLogo title="custom title" width={111} height={20} />
      </LogoWrapper>
    </li>
  </List>
)
All.storyName = 'all'

const List = styled.ul`
  margin: 0;
  padding: 8px;

  & > li {
    display: inline-block;
    padding: 16px;
  }
`
const Text = styled.p`
  margin: 0 0 8px;
`
const LogoWrapper = styled.div(() => {
  const { color, spacingByChar } = useTheme()
  return css`
    display: inline-block;
    line-height: 0;
    padding: ${spacingByChar(1)};
    background-color: ${color.BRAND};
    &.white {
      background-color: ${color.WHITE};
    }
  `
})
