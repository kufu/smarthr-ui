import * as React from 'react'
import { storiesOf } from '@storybook/react'

import Dropdown from './Dropdown'
import DropdownTrigger from './DropdownTrigger'
import DropdownContent from './DropdownContent'

const Component = () => (
  <div style={{ display: 'inline-block' }}>
    <Dropdown>
      <DropdownTrigger>
        <div>Click me.</div>
      </DropdownTrigger>
      <DropdownContent>
        <div style={{ padding: '10px' }}>Rendered!</div>
      </DropdownContent>
    </Dropdown>
  </div>
)

storiesOf('Dropdown/position', module)
  .add('left', () => (
    <div style={{ textAlign: 'left' }}>
      <Component />
    </div>
  ))
  .add('right', () => (
    <div style={{ textAlign: 'right' }}>
      <Component />
    </div>
  ))
