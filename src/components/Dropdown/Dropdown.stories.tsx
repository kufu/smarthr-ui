import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { Dropdown } from './Dropdown'
import { DropdownTrigger } from './DropdownTrigger'
import { DropdownContent } from './DropdownContent'
import { DropdownCloser } from './DropdownCloser'
import { SecondaryButton, PrimaryButton } from '../Button'
import { RadioButtonLabel } from '../RadioButtonLabel'
import { Input } from '../Input'

import readme from './README.md'

const ListMenu = () => (
  <List>
    <li>
      <button onClick={action('clicked item 1')}>Dropdown list item 1, click me.</button>
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

const ControllableDropdown = () => {
  const [value, setValue] = React.useState('hoge')
  const [text, setText] = React.useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)

  return (
    <Dropdown>
      <DropdownTrigger>
        <SecondaryButton>trigger button</SecondaryButton>
      </DropdownTrigger>
      <DropdownContent controllable>
        <>
          <ControllableBoxMain>
            <Text>
              Use `DropdownControllableContent` to get a controllable dropdown.
              <br />
              Clicking inside content of controllable dropdown does not close dropdown.
              <br />
              In that case, you can use `DropdownCloser` to close the dropdown.
            </Text>
            <RadioButtonList>
              <li>
                <RadioButtonLabel
                  name="hoge"
                  label="hoge"
                  checked={value === 'hoge'}
                  onChange={onChangeValue}
                />
              </li>
              <li>
                <RadioButtonLabel
                  name="fuga"
                  label="fuga"
                  checked={value === 'fuga'}
                  onChange={onChangeValue}
                />
              </li>
              <li>
                <RadioButtonLabel
                  name="piyo"
                  label="piyo"
                  checked={value === 'piyo'}
                  onChange={onChangeValue}
                />
              </li>
              <li>
                <Input name="test" value={text} onChange={onChangeText} />
              </li>
            </RadioButtonList>
          </ControllableBoxMain>
          <ControllableBoxBottom>
            <DropdownCloser>
              <SecondaryButton>Close only</SecondaryButton>
            </DropdownCloser>
            <DropdownCloser>
              <PrimaryButton onClick={action('clicked button 1')}>Action and close</PrimaryButton>
            </DropdownCloser>
            <PrimaryButton onClick={action('clicked button 2')}>Action only</PrimaryButton>
          </ControllableBoxBottom>
        </>
      </DropdownContent>
    </Dropdown>
  )
}

storiesOf('Dropdown', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Wrapper>
      <Legends>
        <li>
          <Box>
            <Dropdown>
              <DropdownTrigger>
                <SecondaryButton>Uncontrollable Dropdown</SecondaryButton>
              </DropdownTrigger>
              <DropdownContent>
                <ListMenu />
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
                <ListMenu />
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
                  <ListMenu />
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
  ))

const List = styled.ul`
  margin: 0;
  padding: 10px 0;
  list-style: none;

  & > li > button {
    line-height: 40px;
    width: 100%;
    padding: 0 20px;
    border: none;
    background-color: #fff;
    font-size: 16px;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`
const Wrapper = styled.div`
  padding: 24px;
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
const Text = styled.p`
  margin: 0;
  font-size: 16px;
`
const ControllableBoxBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #d6d6d6;
  padding: 16px 24px;

  & > *:not(:first-child) {
    margin-left: 16px;
  }
`
const Description = styled.p`
  margin: 0;
  padding: 100px 0;
  font-size: 20px;
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
