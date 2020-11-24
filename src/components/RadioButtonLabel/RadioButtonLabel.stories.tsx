import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import readme from './README.md'

import { RadioButtonLabel } from './RadioButtonLabel'

storiesOf('RadioButtonLabel', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <List>
      <li>
        <RadioButtonLabel
          label="light / unchecked"
          name="sample"
          checked={false}
          onChange={action('onChange')}
        />
      </li>
      <li>
        <RadioButtonLabel
          label="light / checked"
          name="sample"
          checked={true}
          onChange={action('onChange')}
        />
      </li>
      <li>
        <RadioButtonLabel
          label="light / unchecked / disabled"
          name="sample"
          checked={false}
          disabled={true}
          onChange={action('onChange')}
        />
      </li>
      <li>
        <RadioButtonLabel
          label="light / checked / disabled"
          name="sample"
          checked={true}
          disabled={true}
          onChange={action('onChange')}
        />
      </li>
    </List>
  ))

const List = styled.ul`
  padding: 0 24px;
  list-style: none;

  & > li {
    padding: 16px;

    &:not(:first-child) {
      margin-top: 8px;
    }

    &.dark {
      background-color: gray;
    }
  }
`
