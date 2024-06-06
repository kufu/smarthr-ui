import { StoryFn } from '@storybook/react'
import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'

import { CheckBox } from './CheckBox'

export default {
  title: 'Forms（フォーム）/CheckBox',
  component: CheckBox,
}

export const All: StoryFn = () => {
  const [checkedName, setCheckedName] = useState<string[]>([])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentName = e.currentTarget.name

    if (checkedName.includes(currentName)) {
      setCheckedName(checkedName.filter((name) => name !== currentName))
    } else {
      setCheckedName([...checkedName, currentName])
    }
  }

  return (
    <WrapperList>
      <li>
        <Title>With children prop</Title>

        <InnerList>
          <li>
            <CheckBox name="1" checked={checkedName.includes('1')} onChange={handleChange}>
              CheckBox
            </CheckBox>
          </li>

          <li>
            <CheckBox name="error" error onChange={handleChange}>
              CheckBox / error
            </CheckBox>
          </li>

          <li>
            <CheckBox name="disabled" disabled onChange={handleChange}>
              CheckBox / disabled
            </CheckBox>
          </li>

          <li>
            <CheckBox name="disabled_checked" checked disabled onChange={handleChange}>
              CheckBox / disabled /checked
            </CheckBox>
          </li>
        </InnerList>
      </li>

      <li>
        <Title>Without children prop</Title>

        <InnerList>
          <li>
            <CheckBox name="2" checked={checkedName.includes('2')} onChange={handleChange} />
          </li>

          <li>
            <CheckBox name="error" error onChange={handleChange} />
          </li>

          <li>
            <CheckBox name="disabled" disabled onChange={handleChange} />
          </li>

          <li>
            <CheckBox name="checked_disabled" checked disabled onChange={handleChange} />
          </li>
        </InnerList>
      </li>

      <li>
        <Title>With mixed prop</Title>

        <InnerList>
          <li>
            <CheckBox name="3" checked={checkedName.includes('3')} mixed onChange={handleChange}>
              CheckBox / mixed
            </CheckBox>
          </li>

          <li>
            <CheckBox
              name="mixed_error"
              checked={checkedName.includes('mixed_error')}
              mixed
              error
              onChange={handleChange}
            >
              CheckBox / mixed / error
            </CheckBox>
          </li>

          <li>
            <CheckBox name="mixed_disabled" mixed disabled onChange={handleChange}>
              CheckBox / mixed / disabled
            </CheckBox>
          </li>

          <li>
            <CheckBox name="mixed_disabled_checked" checked mixed disabled onChange={handleChange}>
              CheckBox / mixed / disabled / checked
            </CheckBox>
          </li>
        </InnerList>
      </li>

      <li>
        <Title>With multiline text</Title>

        <InnerList>
          <li>
            <CheckBox name="4" checked={checkedName.includes('4')} onChange={handleChange}>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </CheckBox>
          </li>
        </InnerList>
      </li>

      <li>
        <Title>With long text</Title>

        <InnerList>
          <li>
            <CheckBox name="4" checked={checkedName.includes('4')} onChange={handleChange}>
              {'a'.repeat(100)}
            </CheckBox>
          </li>
        </InnerList>
      </li>
    </WrapperList>
  )
}
All.storyName = 'all'

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
  margin: 0 0 16px;
`
