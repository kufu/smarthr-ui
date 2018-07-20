import * as React from 'react'
import { storiesOf } from '@storybook/react'

import Dropdown from './Dropdown'
import DropdownTrigger from './DropdownTrigger'
import DropdownContent from './DropdownContent'

storiesOf('Dropdown', module).add('default', () => (
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
))
