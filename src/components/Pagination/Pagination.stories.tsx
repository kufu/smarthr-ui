import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Pagination } from './Pagination'

export default {
  title: 'Navigation（ナビゲーション）/Pagination',
  component: Pagination,
}

const Template: StoryFn = () => {
  const [current, setCurrent] = useState(7)

  return (
    <List>
      <li>
        <Txt>default</Txt>
        <Pagination
          current={current}
          total={13}
          onClick={(page) => {
            setCurrent(page)
          }}
        />
      </li>
      <li>
        <Txt>padding = 1</Txt>
        <Pagination current={7} total={13} onClick={action('click!!')} padding={1} />
      </li>
      <li>
        <Txt>current = 1, total = 5</Txt>
        <Pagination current={1} total={5} onClick={action('click!!')} />
      </li>
      <li>
        <Txt>current = 5, total = 5</Txt>
        <Pagination current={5} total={5} onClick={action('click!!')} />
      </li>
      <li>
        <Txt>current = 2, total = 3</Txt>
        <Pagination current={2} total={3} onClick={action('click!!')} />
      </li>
      <li>
        <Txt>current = 1, total = 2</Txt>
        <Pagination current={1} total={2} onClick={action('click!!')} />
      </li>
      <li>
        <Txt>current = 1, total = 1</Txt>
        <Pagination current={1} total={1} onClick={action('click!!')} />
      </li>
      <li>
        <Txt>current = 1, total = 5, withoutNumbers = true</Txt>
        <Pagination current={1} total={5} onClick={action('click!!')} withoutNumbers />
      </li>
      <li>
        <Txt>current = 2, total = 5, withoutNumbers = true</Txt>
        <Pagination current={2} total={5} onClick={action('click!!')} withoutNumbers />
      </li>
    </List>
  )
}

export const All = Template.bind({})

export const RegFocus = Template.bind({})
RegFocus.play = () => userEvent.tab()

const List = styled.ul`
  list-style-type: none;
  margin-block: unset;
  padding: 0 20px;

  & > li {
    &:not(:first-child) {
      margin-top: 20px;
    }
  }
`
const Txt = styled.p`
  margin: 0 0 10px;
`
