import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import readme from './README.md'

import { RadioButtonLabelNew } from './RadioButtonLabelNew'

storiesOf('RadioButtonLabelNew', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => {
    const [checkedName, setCheckedName] = useState<string | null>(null)
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setCheckedName(e.currentTarget.name)

    return (
      <WrapperList>
        <li>
          <Title>With children prop</Title>

          <InnerList>
            <li>
              <RadioButtonLabelNew name="1" checked={checkedName === '1'} onChange={handleChange}>
                RadioButtonLabelNew
              </RadioButtonLabelNew>
            </li>

            <li>
              <RadioButtonLabelNew
                name="2"
                checked={checkedName === '2'}
                disabled
                onChange={handleChange}
              >
                RadioButtonLabelNew / disabled
              </RadioButtonLabelNew>
            </li>
          </InnerList>
        </li>

        <li>
          <Title>Without children prop</Title>

          <InnerList>
            <li>
              <RadioButtonLabelNew name="3" checked={checkedName === '3'} onChange={handleChange} />
            </li>

            <li>
              <RadioButtonLabelNew
                name="4"
                checked={checkedName === '4'}
                disabled
                onChange={handleChange}
              />
            </li>
          </InnerList>
        </li>
      </WrapperList>
    )
  })

const WrapperList = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li {
    padding: 16px;

    &:not(:first-child) {
      margin-top: 8px;
    }
  }
`
const InnerList = styled.ul`
  padding: 0;
  list-style: none;

  & > li {
    display: inline-block;

    &:not(:first-child) {
      margin-left: 16px;
    }
  }
`
const Title = styled.p`
  margin: 0 0 16px 0;
`
