import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Checkbox } from './Checkbox'

storiesOf('Checkbox', module).add('all', () => (
  <List>
    <li>
      <Checkbox name="sample" checked={false} onChange={action('onChange')} />
    </li>
    <li>
      <Checkbox name="sample" checked={true} onChange={action('onChange')} />
    </li>
    <li>
      <Checkbox name="sample" checked={false} disabled={true} onChange={action('onChange')} />
    </li>
    <li>
      <Checkbox name="sample" checked={true} disabled={true} onChange={action('onChange')} />
    </li>
    <li className="dark">
      <Checkbox name="sample" checked={false} onChange={action('onChange')} themeColor="dark" />
    </li>
    <li className="dark">
      <Checkbox name="sample" checked={true} onChange={action('onChange')} themeColor="dark" />
    </li>
  </List>
))

const List = styled.ul`
  padding: 0 24px;

  & > li {
    display: inline-block;
    padding: 16px;

    &:not(:first-child) {
      margin-left: 16px;
    }

    &.dark {
      background-color: gray;
    }
  }
`
