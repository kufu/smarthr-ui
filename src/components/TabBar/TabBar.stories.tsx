import * as React from 'react'
import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'

import styled from 'styled-components'

import { TabItem } from './TabItem'
import { TabBar } from './TabBar'

import readme from './README.md'

storiesOf('TabBar', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
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
  ))

const Ul = styled.ul`
  padding: 0 1rem;

  li {
    margin-bottom: 1rem;
    list-style: none;
  }
`
