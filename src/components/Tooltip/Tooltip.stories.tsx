import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import {
  FaArrowAltCircleDownIcon,
  FaArrowAltCircleLeftIcon,
  FaArrowAltCircleRightIcon,
  FaArrowAltCircleUpIcon,
} from '../Icon'
import { Tooltip } from './Tooltip'

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
        <Tooltip message="LightBalloon">LightTooltip</Tooltip>
      </dd>
      <dt>horizontal & vertical</dt>
      <dd>
        <Tooltip
          message="horizontal=left & vertical=bottom (default)"
          horizontal="left"
          vertical="bottom"
        >
          horizontal=left & vertical=bottom (default)
        </Tooltip>
      </dd>
      <dd className="center">
        <Tooltip
          message="horizontal=center & vertical=bottom"
          horizontal="center"
          vertical="bottom"
        >
          horizontal=center & vertical=bottom
        </Tooltip>
      </dd>
      <dd className="right">
        <Tooltip message="horizontal=right & vertical=bottom" horizontal="right" vertical="bottom">
          horizontal=right & vertical=bottom
        </Tooltip>
      </dd>
      <dd>
        <Tooltip message="horizontal=left & vertical=middle" horizontal="left" vertical="middle">
          horizontal=left & vertical=middle
        </Tooltip>
      </dd>
      <dd className="right">
        <Tooltip message="horizontal=right & vertical=middle" horizontal="right" vertical="middle">
          horizontal=right & vertical=middle
        </Tooltip>
      </dd>
      <dd>
        <Tooltip message="horizontal=left & vertical=top" horizontal="left" vertical="top">
          horizontal=left & vertical=top
        </Tooltip>
      </dd>
      <dd className="center">
        <Tooltip message="horizontal=center & vertical=top" horizontal="center" vertical="top">
          horizontal=center & vertical=top
        </Tooltip>
      </dd>
      <dd className="right">
        <Tooltip message="horizontal=right & vertical=top" horizontal="right" vertical="top">
          horizontal=right & vertical=top
        </Tooltip>
      </dd>
      <dt>ellipsisOnly</dt>
      <dd className="limit">
        <Tooltip message="invisible message" ellipsisOnly={true}>
          ellipsisOnly: invisible
        </Tooltip>
      </dd>
      <dd className="limit">
        <Tooltip message="visible message" ellipsisOnly={true}>
          <Text>
            ellipsisOnly: visible: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de
            la Santísima Trinidad Ruiz Picasso
          </Text>
        </Tooltip>
      </dd>
      <dt>multiLine</dt>
      <dd className="limit">
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
        >
          <Text>
            MultiLineMessage: Pablo Diego José Francisco de Paula Juan Nepomuceno Cipriano de la
            Santísima Trinidad Ruiz Picasso
          </Text>
        </Tooltip>
      </dd>
      <dt>triggerType</dt>
      <dd className="center">
        <Tooltip
          message="horizontal=left & vertical=bottom (default)"
          horizontal="left"
          vertical="bottom"
          triggerType="icon"
        >
          <FaArrowAltCircleUpIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
        <Tooltip
          message="horizontal=center & vertical=bottom"
          horizontal="center"
          vertical="bottom"
          triggerType="icon"
        >
          <FaArrowAltCircleUpIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
        <Tooltip
          message="horizontal=right & vertical=bottom"
          horizontal="right"
          vertical="bottom"
          triggerType="icon"
        >
          <FaArrowAltCircleUpIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
        <Tooltip
          message="horizontal=left & vertical=middle"
          horizontal="left"
          vertical="middle"
          triggerType="icon"
        >
          <FaArrowAltCircleRightIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
        <Tooltip
          message="horizontal=right & vertical=middle"
          horizontal="right"
          vertical="middle"
          triggerType="icon"
        >
          <FaArrowAltCircleLeftIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
        <Tooltip
          message="horizontal=left & vertical=top"
          horizontal="left"
          vertical="top"
          triggerType="icon"
        >
          <FaArrowAltCircleDownIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
        <Tooltip
          message="horizontal=center & vertical=top"
          horizontal="center"
          vertical="top"
          triggerType="icon"
        >
          <FaArrowAltCircleDownIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
        <Tooltip
          message="horizontal=right & vertical=top"
          horizontal="right"
          vertical="top"
          triggerType="icon"
        >
          <FaArrowAltCircleDownIcon visuallyHiddenText="フォーカスすると情報が表示されます" />
        </Tooltip>
      </dd>
      <dt>自動位置決め</dt>
      {[undefined, 'center', 'right'].map((className) => (
        <dd className={className} key={className}>
          <Tooltip
            message="メッセージメッセージメッセージメッセージメッセージメッセージメッセージ"
            horizontal="auto"
            vertical="auto"
          >
            horizontal=auto & vertical=auto
          </Tooltip>
        </dd>
      ))}
      <dd style={{ marginBottom: '100vh' }}>
        <Tooltip
          message="メッセージメッセージメッセージメッセージメッセージメッセージメッセージ"
          horizontal="auto"
          vertical="auto"
          multiLine
        >
          multiLine 指定時
        </Tooltip>
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
