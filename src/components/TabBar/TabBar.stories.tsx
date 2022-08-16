import * as React from 'react'
import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'

import styled from 'styled-components'

import { TabItem } from './TabItem'
import { TabBar } from './TabBar'

export default {
  title: 'TabBar',
  component: TabBar,
  subcomponents: { TabItem },
}

const Template: Story = () => (
  <Ul>
    <li>
      <p>Border</p>
      <TabBar>
        <TabItem id="1" onClick={action('clicked')}>
          Tab
        </TabItem>
        <TabItem id="2" onClick={action('clicked')} selected>
          Selected
        </TabItem>
        <TabItem id="3" onClick={action('clicked')} disabled>
          Disabled
        </TabItem>
      </TabBar>
    </li>
    <li>
      <p>No border</p>
      <TabBar bordered={false}>
        <TabItem id="1" onClick={action('clicked')}>
          Tab
        </TabItem>
        <TabItem id="2" onClick={action('clicked')} selected>
          Selected
        </TabItem>
        <TabItem id="3" onClick={action('clicked')} disabled>
          Disabled
        </TabItem>
      </TabBar>
    </li>
  </Ul>
)

export const All = Template.bind({})

export const RegFocusBorder = Template.bind({})
RegFocusBorder.play = () => userEvent.tab()

export const RegFocusNoBorder = Template.bind({})
RegFocusNoBorder.play = () => [...Array(3)].forEach((_) => userEvent.tab())

const Ul = styled.ul`
  padding: 0 1rem;

  li {
    margin-bottom: 1rem;
    list-style: none;
  }
`
