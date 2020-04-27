import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Icon } from '../Icon'
import { Tooltip } from './Tooltip'

storiesOf('Tooltip', module).add('all', () => (
  <List>
    <dt>Default</dt>
    <dd>
      <Tooltip message="Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima Trinidad Ruiz Picasso">
        Default: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima
        Trinidad Ruiz Picasso
      </Tooltip>
    </dd>
    <dt>ellipsisOnly</dt>
    <dd>
      <Tooltip message="invisible message" ellipsisOnly={true}>
        invisible
      </Tooltip>
    </dd>
    <dd>
      <Tooltip
        message="Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima Trinidad Ruiz Picasso"
        ellipsisOnly={true}
      >
        <Text>
          visible: Ellipsis Only: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
          Santísima Trinidad Ruiz Picasso
        </Text>
      </Tooltip>
    </dd>
    <dt>multiLine</dt>
    <dd>
      <Tooltip
        message="Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima Trinidad Ruiz Picasso"
        multiLine={true}
      >
        MultiLineMessage: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
        Santísima Trinidad Ruiz Picasso
      </Tooltip>
    </dd>
    <dt>ReactNode message attribute</dt>
    <dd>
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
    </dd>
    <dt>triggerType</dt>
    <dd>
      <Tooltip message="Icon Message" triggerType="icon">
        <Icon name="fa-question-circle" />
      </Tooltip>
    </dd>
  </List>
))

const List = styled.dl`
  margin-top: 100px;
  padding: 0 24px;
  list-style: none;

  & > {
    dt {
      font-weight: bold;
      &:not(:first-child) {
        margin-top: 16px;
      }
    }
    dd {
      margin-top: 5px;
      width: 200px;
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
