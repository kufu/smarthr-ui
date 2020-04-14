import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Icon } from '../Icon'
import { Tooltip } from './Tooltip'

storiesOf('Tooltip', module).add('all', () => (
  <List>
    <li>
      <Tooltip message="Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima Trinidad Ruiz Picasso">
        Default: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima
        Trinidad Ruiz Picasso
      </Tooltip>
    </li>
    <li>
      <Tooltip message="invisible message" ellipsisOnly={true}>
        Ellipsis Only
      </Tooltip>
      <Tooltip
        message="Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima Trinidad Ruiz Picasso"
        ellipsisOnly={true}
      >
        <Text>
          Ellipsis Only: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
          Santísima Trinidad Ruiz Picasso
        </Text>
      </Tooltip>
    </li>
    <li>
      <Tooltip
        message="Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima Trinidad Ruiz Picasso"
        multiLine={true}
      >
        MultiLineMessage: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
        Santísima Trinidad Ruiz Picasso
      </Tooltip>
    </li>
    <li>
      <Tooltip
        message={
          <>
            MultiLineMessage
            <br />
            MultiLine 1<br />
            MultiLine 2<br />
            MultiLine 3<br />
            ...
          </>
        }
        multiLine={true}
      >
        <Text>
          MultiLineMessage: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
          Santísima Trinidad Ruiz Picasso
        </Text>
      </Tooltip>
    </li>
    <li>
      <Tooltip message="Icon Message" triggerType="icon">
        <Icon name="fa-question-circle" />
      </Tooltip>
    </li>
  </List>
))

const List = styled.ul`
  width: 200px;
  margin-top: 100px;
  padding: 0 24px;
  list-style: none;

  & > li {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
`

const Text = styled.span`
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
