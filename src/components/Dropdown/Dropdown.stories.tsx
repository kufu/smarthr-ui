import * as React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import { Dropdown } from './Dropdown'
import { DropdownTrigger } from './DropdownTrigger'
import { DropdownContent } from './DropdownContent'

storiesOf('Dropdown', module).add('all', () => (
  <Wrapper>
    <Dropdown dropdownKey="test-1">
      <DropdownTrigger>
        <Txt>Click me (left position)</Txt>
      </DropdownTrigger>
      <DropdownContent>
        <BalloonInner>Rendered!</BalloonInner>
      </DropdownContent>
    </Dropdown>

    <Dropdown dropdownKey="test-2">
      <DropdownTrigger>
        <Txt>Click me (right position)</Txt>
      </DropdownTrigger>
      <DropdownContent>
        <BalloonInner>Rendered!</BalloonInner>
      </DropdownContent>
    </Dropdown>
  </Wrapper>
))

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`
const Txt = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 16px;
`
const BalloonInner = styled.p`
  margin: 0;
  padding: 10px;
  font-size: 14px;
`
