import { Story } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'

import { FilterDropdown } from './FilterDropdown'
import { RadioButtonLabel } from '../../RadioButtonLabel'
import { Input } from '../../Input'

import readme from './README.md'

export default {
  title: 'FilterDropdown',
  Component: FilterDropdown,
  parameters: {
    docs: {
      description: { component: readme },
      source: {
        type: 'code',
      },
    },
  },
}

export const Default: Story = () => {
  const [value, setValue] = React.useState('hoge')
  const [text, setText] = React.useState('')
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
  const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)
  const themes = useTheme()
  const [isFiltered, setIsFiltered] = React.useState(false)
  const [isFiltered2, setIsFiltered2] = React.useState(true)
  const [isFiltered3, setIsFiltered3] = React.useState(true)

  return (
    <Wrapper themes={themes}>
      <List>
        <dt>nonFiltered</dt>
        <dd>
          <FilterDropdown
            onApply={() => setIsFiltered(true)}
            onCancel={() => setIsFiltered(false)}
            onReset={() => {
              setValue('hoge')
              setText('')
            }}
            isFiltered={isFiltered}
          >
            <Text themes={themes}>
              `FilterDropdown` provide specific interface to be able to filter data.
              <br />
              You can control inputs for filtering conditions as children components.
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
            <Description>
              ↓<br />↓
            </Description>
            <Text themes={themes}>Children content is scrollable.</Text>
          </FilterDropdown>
        </dd>
        <dt>Filtered</dt>
        <dd>
          <FilterDropdown
            isFiltered={isFiltered2}
            onApply={() => setIsFiltered2(true)}
            onReset={() => setIsFiltered2(false)}
          >
            <Text themes={themes}>
              You can change border color of the trigger button by setting `isFiltered`.
            </Text>
          </FilterDropdown>
        </dd>
        <dt>Filtered has status text</dt>
        <dd>
          <FilterDropdown
            isFiltered={isFiltered3}
            onApply={() => setIsFiltered3(true)}
            onReset={() => setIsFiltered3(false)}
            hasStatusText
          >
            <Text themes={themes}>
              You can change border text and color of the trigger button by setting `isFiltered`.
            </Text>
          </FilterDropdown>
        </dd>
      </List>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  padding: 24px;
  color: ${({ themes }) => themes.color.TEXT_BLACK};
`
const List = styled.dl`
  margin: 0;
  dt {
    margin-bottom: 8px;
    &:not(:first-child) {
      margin-top: 24px;
    }
  }
  dd {
    margin: 0;
  }
`
const Text = styled.p<{ themes: Theme }>`
  margin: 0;
  font-size: 14px;
  color: ${({ themes }) => themes.color.TEXT_BLACK};
`
const Description = styled.p`
  margin: 0;
  padding: 100px 0;
  font-size: 20px;
`
const RadioButtonList = styled.ul`
  list-style: none;
`
