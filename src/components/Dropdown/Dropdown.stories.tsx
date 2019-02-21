import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Dropdown } from './Dropdown'
import { DropdownContent } from './DropdownContent'
import { DropdownTrigger } from './DropdownTrigger'

const Menu = () => (
  <List>
    <li>list item 1</li>
    <li>list item 2</li>
    <li>list item 3</li>
    <li>list item 4</li>
  </List>
)

storiesOf('Dropdown', module).add('all', () => (
  <Wrapper>
    <TopLeft>
      <Dropdown>
        <DropdownTrigger>
          <Button>top left position</Button>
        </DropdownTrigger>
        <DropdownContent>
          <Menu />
        </DropdownContent>
      </Dropdown>
    </TopLeft>

    <TopRight>
      <Dropdown>
        <DropdownTrigger>
          <Button>
            top right position
            <br />
            You can specify offset.x for DropdownContent.
          </Button>
        </DropdownTrigger>
        <DropdownContent offset={{ x: 30 }}>
          <Menu />
        </DropdownContent>
      </Dropdown>
    </TopRight>

    <BottomLeft>
      <Dropdown>
        <DropdownTrigger>
          <Button>
            bottom left position
            <br />
            You can specify offset.y for DropdownContent.
          </Button>
        </DropdownTrigger>
        <DropdownContent offset={{ x: 30, y: 100 }}>
          <Menu />
        </DropdownContent>
      </Dropdown>
    </BottomLeft>

    <BottomRight>
      <Dropdown>
        <DropdownTrigger>
          <Button>
            bottom right position
            <br /> Offset accepts negative value
          </Button>
        </DropdownTrigger>
        <DropdownContent offset={{ x: -50 }}>
          <Menu />
        </DropdownContent>
      </Dropdown>
    </BottomRight>
  </Wrapper>
))

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
`
const TopLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`
const TopRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`
const BottomLeft = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`
const BottomRight = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`
const Button = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #d6d6d6;
  cursor: pointer;
`
const List = styled.ul`
  margin: 0;
  padding: 10px 0;
  list-style: none;

  & > li {
    padding: 0 20px;
    line-height: 40px;
    font-size: 16px;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`
