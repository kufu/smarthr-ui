import { StoryFn } from '@storybook/react'
import { userEvent } from '@storybook/test'
import * as React from 'react'
import { useSyncExternalStore } from 'react'
import styled from 'styled-components'

import { Button } from '../Button'
import { FaArrowDownIcon, FaArrowLeftIcon, FaArrowRightIcon, FaArrowUpIcon } from '../Icon'

import { Tooltip } from './Tooltip'

export default {
  title: 'Data Display（データ表示）/Tooltip',
  component: Tooltip,
}

const subscribeFullscreenChange = (callback: () => void) => {
  window.addEventListener('fullscreenchange', callback)
  return () => {
    window.removeEventListener('fullscreenchange', callback)
  }
}
const getFullscreenElement = () => document.fullscreenElement

const Template: StoryFn = () => {
  const fullscreenElementRef = React.useRef<HTMLDivElement>(null)
  const enterFullscreen = () => {
    if (fullscreenElementRef.current) {
      fullscreenElementRef.current.requestFullscreen()
    }
  }
  const exitFullscreen = () => {
    document.exitFullscreen()
  }
  const fullscreenElement = useSyncExternalStore(subscribeFullscreenChange, getFullscreenElement)

  return (
    <Wrapper ref={fullscreenElementRef}>
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
          <Tooltip
            message="horizontal=right & vertical=bottom"
            horizontal="right"
            vertical="bottom"
          >
            horizontal=right & vertical=bottom
          </Tooltip>
        </dd>
        <dd>
          <Tooltip message="horizontal=left & vertical=middle" horizontal="left" vertical="middle">
            horizontal=left & vertical=middle
          </Tooltip>
        </dd>
        <dd className="right">
          <Tooltip
            message="horizontal=right & vertical=middle"
            horizontal="right"
            vertical="middle"
          >
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
            <FaArrowUpIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
          <Tooltip
            message="horizontal=center & vertical=bottom"
            horizontal="center"
            vertical="bottom"
            triggerType="icon"
          >
            <FaArrowUpIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
          <Tooltip
            message="horizontal=right & vertical=bottom"
            horizontal="right"
            vertical="bottom"
            triggerType="icon"
          >
            <FaArrowUpIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
          <Tooltip
            message="horizontal=left & vertical=middle"
            horizontal="left"
            vertical="middle"
            triggerType="icon"
          >
            <FaArrowRightIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
          <Tooltip
            message="horizontal=right & vertical=middle"
            horizontal="right"
            vertical="middle"
            triggerType="icon"
          >
            <FaArrowLeftIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
          <Tooltip
            message="horizontal=left & vertical=top"
            horizontal="left"
            vertical="top"
            triggerType="icon"
          >
            <FaArrowDownIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
          <Tooltip
            message="horizontal=center & vertical=top"
            horizontal="center"
            vertical="top"
            triggerType="icon"
          >
            <FaArrowDownIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
          <Tooltip
            message="horizontal=right & vertical=top"
            horizontal="right"
            vertical="top"
            triggerType="icon"
          >
            <FaArrowDownIcon alt="フォーカスすると情報が表示されます" />
          </Tooltip>
        </dd>
        <dt>disabled ボタン</dt>
        <dd>
          <Tooltip message="disabled なボタンに表示するツールチップです">
            <Button disabled>ボタン</Button>
          </Tooltip>
        </dd>
        <dt>自動位置決め</dt>
        {[undefined, 'center', 'right'].map((className, i) => (
          <dd className={className} key={i}>
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

      <ButtonWrapper>
        {fullscreenElement ? (
          <Button onClick={exitFullscreen}>Exit Fullscreen</Button>
        ) : (
          <Button onClick={enterFullscreen}>Enter Fullscreen</Button>
        )}
      </ButtonWrapper>
    </Wrapper>
  )
}
export const All = Template.bind({})

export const RegHover = Template.bind({})
RegHover.play = ({ canvasElement }) => {
  const tooltips = canvasElement.querySelectorAll('.smarthr-ui-Tooltip')
  tooltips.forEach((tooltip) => userEvent.hover(tooltip))
}

const Wrapper = styled.div`
  background: #fff;
  overflow: auto;
`

const ButtonWrapper = styled.div`
  padding: 16px;
`

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
