import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import readme from './README.md'

import { RadioButton } from './RadioButton'

storiesOf('RadioButton', module)
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
              <RadioButton name="1" checked={checkedName === '1'} onChange={handleChange}>
                RadioButton
              </RadioButton>
            </li>

            <li>
              <RadioButton name="2" checked={checkedName === '2'} disabled onChange={handleChange}>
                RadioButton / disabled
              </RadioButton>
            </li>
          </InnerList>
        </li>

        <li>
          <Title>Without children prop</Title>

          <InnerList>
            <li>
              <RadioButton name="3" checked={checkedName === '3'} onChange={handleChange} />
            </li>

            <li>
              <RadioButton
                name="4"
                checked={checkedName === '4'}
                disabled
                onChange={handleChange}
              />
            </li>
          </InnerList>
        </li>

        <li>
          <Title>With multiline text</Title>

          <InnerList>
            <li>
              <RadioButton name="5" checked={checkedName === '5'} onChange={handleChange}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
                Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged. It was popularised in the 1960s with
                the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                with desktop publishing software like Aldus PageMaker including versions of Lorem
                Ipsum.
              </RadioButton>
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
