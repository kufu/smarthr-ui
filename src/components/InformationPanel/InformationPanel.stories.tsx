import { Story } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from './InformationPanel'
import readme from './README.md'

export default {
  title: 'InformationPanel',
  component: InformationPanel,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => (
  <List>
    <li>
      <Wrapper>
        <InformationPanel title="Panel Title" openButtonLabel="OPEN" closeButtonLabel="CLOSE">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </InformationPanel>
      </Wrapper>
    </li>
    <li>
      <Wrapper>
        <InformationPanel title="Panel without a toggle button" togglable={false}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
          est laborum.
        </InformationPanel>
      </Wrapper>
    </li>
  </List>
)
All.storyName = 'all'

const List = styled.ul`
  list-style: none;
  padding: 0;
`
const Wrapper = styled.div`
  width: 1140px;
  margin: 32px auto;
`
