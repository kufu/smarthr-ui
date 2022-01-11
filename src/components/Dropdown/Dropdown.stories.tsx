import { Story } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { Dropdown } from './Dropdown'
import { DropdownTrigger } from './DropdownTrigger'
import { DropdownContent } from './DropdownContent'
import { DropdownCloser } from './DropdownCloser'
import { DropdownScrollArea } from './DropdownScrollArea'
import { PrimaryButton, SecondaryButton } from '../Button'
import { RadioButton } from '../RadioButton'
import { Input } from '../Input'

import readme from './README.md'

export default {
  title: 'Dropdown',
  component: Dropdown,
  subcomponents: {
    DropdownTrigger,
    DropdownContent,
    DropdownCloser,
    DropdownScrollArea,
  },
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

const ListMenu = () => {
  const themes = useTheme()
  return (
    <List themes={themes}>
      <li>
        <button id="dropdown-list-item-1" onClick={action('clicked item 1')}>
          Dropdown list item 1, click me.
        </button>
      </li>
      <li>
        <button onClick={action('clicked item 2')}>Dropdown list item 2, click me.</button>
      </li>
      <li>
        <button onClick={action('clicked item 3')}>Dropdown list item 3, click me.</button>
      </li>
      <li>
        <button onClick={action('clicked item 4')}>Dropdown list item 4, click me.</button>
      </li>
    </List>
  )
}

const ControllableDropdown = () => {
  const [value, setValue] = React.useState('hoge')
  const [text, setText] = React.useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)
  const themes = useTheme()

  return (
    <Dropdown>
      <DropdownTrigger>
        <SecondaryButton>trigger button</SecondaryButton>
      </DropdownTrigger>
      <DropdownContent controllable>
        <DropdownScrollArea>
          <ControllableBoxMain>
            <Text themes={themes}>
              Use `DropdownControllableContent` to get a controllable dropdown.
              <br />
              Clicking inside content of controllable dropdown does not close dropdown.
              <br />
              In that case, you can use `DropdownCloser` to close the dropdown.
            </Text>
            <RadioButtonList>
              <li>
                <RadioButton name="hoge" checked={value === 'hoge'} onChange={onChangeValue}>
                  hoge
                </RadioButton>
              </li>
              <li>
                <RadioButton name="fuga" checked={value === 'fuga'} onChange={onChangeValue}>
                  fuga
                </RadioButton>
              </li>
              <li>
                <RadioButton name="piyo" checked={value === 'piyo'} onChange={onChangeValue}>
                  piyo
                </RadioButton>
              </li>
              <li>
                <Input name="test" value={text} onChange={onChangeText} />
              </li>
            </RadioButtonList>
          </ControllableBoxMain>
          <ControllableBoxBottom themes={themes}>
            <DropdownCloser>
              <SecondaryButton>Close only</SecondaryButton>
            </DropdownCloser>
            <DropdownCloser>
              <PrimaryButton onClick={action('clicked button 1')}>Action and close</PrimaryButton>
            </DropdownCloser>
            <PrimaryButton onClick={action('clicked button 2')}>Action only</PrimaryButton>
          </ControllableBoxBottom>
        </DropdownScrollArea>
      </DropdownContent>
    </Dropdown>
  )
}

export const All: Story = () => {
  const themes = useTheme()
  return (
    <Wrapper themes={themes}>
      <Legends>
        <li>
          <Box>
            <Dropdown>
              <DropdownTrigger>
                <SecondaryButton id="dropdown-button-1">Uncontrollable Dropdown</SecondaryButton>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownScrollArea>
                  <ListMenu />
                </DropdownScrollArea>
              </DropdownContent>
            </Dropdown>
          </Box>
        </li>
        <li>
          <Box>
            <Dropdown>
              <DropdownTrigger>
                <SecondaryButton>static area</SecondaryButton>
              </DropdownTrigger>
              <DropdownContent>
                <Fixed themes={themes}>fixed header</Fixed>
                <DropdownScrollArea>
                  <ListMenu />
                </DropdownScrollArea>
                <Fixed themes={themes}>fixed footer</Fixed>
              </DropdownContent>
            </Dropdown>
          </Box>
        </li>
        <li>
          <Box>
            <ControllableDropdown />
          </Box>
        </li>
        <li>
          <Dropdown>
            <DropdownTrigger>
              <SecondaryButton>Nested Dropdown</SecondaryButton>
            </DropdownTrigger>
            <DropdownContent controllable>
              <DropdownScrollArea>
                <ControllableBoxMain>
                  <Dropdown>
                    <DropdownTrigger>
                      <SecondaryButton>Nested Dropdown</SecondaryButton>
                    </DropdownTrigger>
                    <DropdownContent controllable>
                      <DropdownScrollArea>
                        <ControllableBoxMain>
                          <Dropdown>
                            <DropdownTrigger>
                              <SecondaryButton>Nested Dropdown</SecondaryButton>
                            </DropdownTrigger>
                            <DropdownContent>
                              <DropdownScrollArea>
                                <ListMenu />
                              </DropdownScrollArea>
                            </DropdownContent>
                          </Dropdown>
                        </ControllableBoxMain>
                      </DropdownScrollArea>
                    </DropdownContent>
                  </Dropdown>
                </ControllableBoxMain>
              </DropdownScrollArea>
            </DropdownContent>
          </Dropdown>
        </li>
        <li>
          <Description>
            Depending on where `DropdownTrigger` is on window, the position to display
            `DropdownContent` is automatically determined.
          </Description>
          <Description>
            ↓<br />↓
          </Description>
          <Description>
            ↓<br />↓
          </Description>
        </li>
        <li>
          <Box>
            <Dropdown>
              <DropdownTrigger>
                <SecondaryButton>Uncontrollable Dropdown</SecondaryButton>
              </DropdownTrigger>
              <DropdownContent>
                <DropdownScrollArea>
                  <ListMenu />
                </DropdownScrollArea>
              </DropdownContent>
            </Dropdown>
          </Box>
        </li>
        <li>
          <RightAlign>
            <Box>
              <Dropdown>
                <DropdownTrigger>
                  <SecondaryButton>Uncontrollable Dropdown</SecondaryButton>
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownScrollArea>
                    <ListMenu />
                  </DropdownScrollArea>
                </DropdownContent>
              </Dropdown>
            </Box>
          </RightAlign>
        </li>
        <li>
          <Bottom />
        </li>
      </Legends>
    </Wrapper>
  )
}
All.storyName = 'all'

const List = styled.ul<{ themes: Theme }>`
  ${({ themes }) => {
    const { color } = themes
    return css`
      margin: 0;
      padding: 8px 0;
      list-style: none;

      & > li > button {
        line-height: 40px;
        width: 100%;
        padding: 0 20px;
        border: none;
        background-color: ${color.WHITE};
        color: ${color.TEXT_BLACK};

        &:hover {
          background-color: ${color.hoverColor(color.WHITE)};
        }
      }
    `
  }}
`
const Wrapper = styled.div<{ themes: Theme }>`
  padding: 24px;
  color: ${({ themes }) => themes.color.TEXT_BLACK};
`
const Legends = styled.ul`
  margin: 0;
  padding: 10px 0;
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 24px;
  }
`
const Box = styled.div`
  display: inline-block;
`
const ControllableBoxMain = styled.div`
  padding: 24px;
`
const Text = styled.p<{ themes: Theme }>`
  margin: 0;
  color: ${({ themes }) => themes.color.TEXT_BLACK};
`
const ControllableBoxBottom = styled.div<{ themes: Theme }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: ${({ themes }) => themes.border.shorthand};
  padding: 16px 24px;

  & > *:not(:first-child) {
    margin-left: 16px;
  }
`
const Description = styled.p`
  margin: 0;
  padding: 100px 0;
`
const RightAlign = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 100px;
`
const Bottom = styled.div`
  height: 500px;
`
const RadioButtonList = styled.ul`
  list-style: none;
`
const Fixed = styled.div<{ themes: Theme }>`
  width: 100%;
  padding: 0 20px;
  border: none;
  font-weight: bold;
  line-height: 40px;
  color: ${({ themes }) => themes.color.TEXT_BLACK};
`
