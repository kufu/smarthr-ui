import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { CheckBoxLabel } from './CheckBoxLabel'
import readme from './README.md'

const onChange = action('onChange')

storiesOf('CheckBoxLabel', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <Group>
      <li>
        <Text>checked</Text>
        <List>
          <li>
            <CheckBoxLabel label="enabled" name="name1" checked={true} onChange={onChange} />
          </li>
          <li>
            <CheckBoxLabel
              label="disabled"
              name="name2"
              checked={true}
              disabled={true}
              onChange={onChange}
            />
          </li>
        </List>
      </li>

      <li>
        <Text>unchecked</Text>
        <List>
          <li>
            <CheckBoxLabel label="enabled" name="name4" checked={false} onChange={onChange} />
          </li>
          <li>
            <CheckBoxLabel
              label="disabled"
              name="name5"
              checked={false}
              disabled={true}
              onChange={onChange}
            />
          </li>
        </List>
      </li>

      <li>
        <Text>mixed</Text>
        <List>
          <li>
            <CheckBoxLabel
              label="enabled"
              name="name7"
              checked={true}
              mixed={true}
              onChange={onChange}
            />
          </li>
          <li>
            <CheckBoxLabel
              label="disabled"
              name="name8"
              checked={true}
              mixed={true}
              disabled={true}
              onChange={onChange}
            />
          </li>
        </List>
      </li>

      <li>
        <Text>multiline text</Text>
        <List>
          <li>
            <CheckBoxLabel
              label="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
              name="name9"
              checked={true}
              mixed={true}
              onChange={onChange}
            />
          </li>
        </List>
      </li>
    </Group>
  ))

const List = styled.ul`
  padding: 0;

  & > li {
    display: inline-block;
    padding: 16px;
  }
`
const Group = styled.ul`
  list-style: none;

  & > li:not(:first-child) {
    margin-top: 24px;
  }
`
const Text = styled.p`
  margin: 0 0 16px 0;
  font-size: 16px;
`
