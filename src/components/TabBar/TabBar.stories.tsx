import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'
import * as React from 'react'
import styled from 'styled-components'

import { TabBar } from './TabBar'
import { TabItem } from './TabItem'

export default {
  title: 'Navigation（ナビゲーション）/TabBar',
  component: TabBar,
  subcomponents: { TabItem },
}

const Template: Story = () => (
  <Ul>
    <li>
      <p>Border</p>
      <TabBar>
        <TabItem id="border-1" onClick={action('clicked')}>
          Tab
        </TabItem>
        <TabItem id="border-2" onClick={action('clicked')} selected>
          Selected
        </TabItem>
        <TabItem id="border-3" onClick={action('clicked')} disabled>
          Disabled
        </TabItem>
      </TabBar>
    </li>
    <li>
      <p>No border</p>
      <TabBar bordered={false}>
        <TabItem id="no-border-1" onClick={action('clicked')}>
          Tab
        </TabItem>
        <TabItem id="no-border-2" onClick={action('clicked')} selected>
          Selected
        </TabItem>
        <TabItem id="no-border-3" onClick={action('clicked')} disabled>
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
