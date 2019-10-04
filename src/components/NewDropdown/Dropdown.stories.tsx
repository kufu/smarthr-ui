import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Dropdown } from './Dropdown'
import { DropdownTrigger } from './DropdownTrigger'
import { DropdownControllableContent } from './DropdownControllableContent'
import { DropdownCloser } from './DropdownCloser'

storiesOf('NewDropdown', module).add('controll', () => (
  <Wrapper>
    <Box>
      <Dropdown>
        <DropdownTrigger>
          <button>ボタン</button>
        </DropdownTrigger>
        <DropdownControllableContent>
          <div>
            <p>hogefugahogefugahogefuga</p>
            <DropdownCloser>
              <button>close</button>
            </DropdownCloser>
          </div>
        </DropdownControllableContent>
      </Dropdown>
    </Box>
  </Wrapper>
))

const Wrapper = styled.div`
  position: relative;
  height: 2000px;
  padding: 24px;
  box-sizing: border-box;
`
const Box = styled.div`
  display: inline-block;
`
