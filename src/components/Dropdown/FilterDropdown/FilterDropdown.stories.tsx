import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { Theme, useTheme } from '../../../hooks/useTheme'

import { FilterDropdown } from './FilterDropdown'
import { RadioButtonLabel } from '../../RadioButtonLabel'
import { Input } from '../../Input'

import readme from './README.md'

storiesOf('Dropdown', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('filter', () => {
    const [value, setValue] = React.useState('hoge')
    const [text, setText] = React.useState('')
    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.name)
    const onChangeText = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.currentTarget.value)
    const themes = useTheme()

    return (
      <Wrapper themes={themes}>
        <List>
          <dt>Controlled</dt>
          <dd>
            <FilterDropdown
              onApply={action('apply')}
              onCancel={action('cancel')}
              onReset={() => {
                setValue('hoge')
                setText('')
              }}
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
            <FilterDropdown isFiltered onApply={action('apply')} onReset={action('reset')}>
              <Text themes={themes}>
                You can change border color of the trigger button by setting `isFiltered`.
              </Text>
            </FilterDropdown>
          </dd>
        </List>
      </Wrapper>
    )
  })

const Wrapper = styled.div<{ themes: Theme }>`
  padding: 24px;
  color: ${({ themes }) => themes.palette.TEXT_BLACK};
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
  color: ${({ themes }) => themes.palette.TEXT_BLACK};
`
const Description = styled.p`
  margin: 0;
  padding: 100px 0;
  font-size: 20px;
`
const RadioButtonList = styled.ul`
  list-style: none;
`
