import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Icon } from '../Icon'
import { DarkTooltip, LightTooltip } from './Tooltip'

import readme from './README.md'

storiesOf('Tooltip', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <List>
      <dt>Default</dt>
      <dd>
        <LightTooltip message="LightBalloon">LightTooltip</LightTooltip>
      </dd>
      <dd>
        <DarkTooltip message="DarkBalloon">DarkTooltip</DarkTooltip>
      </dd>
      <dt>horizontal & vertical</dt>
      <dd>
        <LightTooltip
          message="horizontal=left & vertical=bottom (default)"
          horizontal="left"
          vertical="bottom"
        >
          horizontal=left & vertical=bottom (default)
        </LightTooltip>
      </dd>
      <dd className="center">
        <LightTooltip
          message="horizontal=center & vertical=bottom"
          horizontal="center"
          vertical="bottom"
        >
          horizontal=center & vertical=bottom
        </LightTooltip>
      </dd>
      <dd className="right">
        <LightTooltip
          message="horizontal=right & vertical=bottom"
          horizontal="right"
          vertical="bottom"
        >
          horizontal=right & vertical=bottom
        </LightTooltip>
      </dd>
      <dd>
        <DarkTooltip
          message="horizontal=left & vertical=middle"
          horizontal="left"
          vertical="middle"
        >
          horizontal=left & vertical=middle
        </DarkTooltip>
      </dd>
      <dd className="right">
        <DarkTooltip
          message="horizontal=right & vertical=middle"
          horizontal="right"
          vertical="middle"
        >
          horizontal=right & vertical=middle
        </DarkTooltip>
      </dd>
      <dd>
        <LightTooltip message="horizontal=left & vertical=top" horizontal="left" vertical="top">
          horizontal=left & vertical=top
        </LightTooltip>
      </dd>
      <dd className="center">
        <LightTooltip message="horizontal=center & vertical=top" horizontal="center" vertical="top">
          horizontal=center & vertical=top
        </LightTooltip>
      </dd>
      <dd className="right">
        <LightTooltip message="horizontal=right & vertical=top" horizontal="right" vertical="top">
          horizontal=right & vertical=top
        </LightTooltip>
      </dd>
      <dt>ellipsisOnly</dt>
      <dd className="limit">
        <DarkTooltip message="invisible message" ellipsisOnly={true}>
          ellipsisOnly: invisible
        </DarkTooltip>
      </dd>
      <dd className="limit">
        <DarkTooltip message="visible message" ellipsisOnly={true}>
          <Text>
            ellipsisOnly: visible: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de
            la Santísima Trinidad Ruiz Picasso
          </Text>
        </DarkTooltip>
      </dd>
      <dt>multiLine</dt>
      <dd className="limit">
        <LightTooltip
          message="Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la Santísima Trinidad Ruiz Picasso"
          multiLine={true}
        >
          MultiLineMessage: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
          Santísima Trinidad Ruiz Picasso
        </LightTooltip>
      </dd>
      <dt>ReactNode message attribute</dt>
      <dd>
        <LightTooltip
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
        >
          <Text>
            MultiLineMessage: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
            Santísima Trinidad Ruiz Picasso
          </Text>
        </LightTooltip>
      </dd>
      <dt>triggerType</dt>
      <dd className="center">
        <LightTooltip
          message="horizontal=left & vertical=bottom (default)"
          horizontal="left"
          vertical="bottom"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-up" />
        </LightTooltip>
        <LightTooltip
          message="horizontal=center & vertical=bottom"
          horizontal="center"
          vertical="bottom"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-up" />
        </LightTooltip>
        <LightTooltip
          message="horizontal=right & vertical=bottom"
          horizontal="right"
          vertical="bottom"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-up" />
        </LightTooltip>
        <DarkTooltip
          message="horizontal=left & vertical=middle"
          horizontal="left"
          vertical="middle"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-right" />
        </DarkTooltip>
        <DarkTooltip
          message="horizontal=right & vertical=middle"
          horizontal="right"
          vertical="middle"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-left" />
        </DarkTooltip>
        <LightTooltip
          message="horizontal=left & vertical=top"
          horizontal="left"
          vertical="top"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-down" />
        </LightTooltip>
        <LightTooltip
          message="horizontal=center & vertical=top"
          horizontal="center"
          vertical="top"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-down" />
        </LightTooltip>
        <LightTooltip
          message="horizontal=right & vertical=top"
          horizontal="right"
          vertical="top"
          triggerType="icon"
        >
          <Icon name="fa-arrow-alt-circle-down" />
        </LightTooltip>
      </dd>
    </List>
  ))

const List = styled.dl`
  margin: 50px 0;
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

      &.limit {
        width: 200px;
      }
      &.center {
        text-align: center;
      }
      &.right {
        text-align: right;
      }
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
