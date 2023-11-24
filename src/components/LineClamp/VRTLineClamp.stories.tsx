import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { LineClamp } from './LineClamp'

export default {
  title: 'Data Display（データ表示）/LineClamp',
  component: LineClamp,
  parameters: {
    withTheming: true,
  },
}

const longText = `
Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem
Ipsum has been the industry's standard dummy text ever since the 1500s, when an
unknown printer took a galley of type and scrambled it to make a type specimen
book. It has survived not only five centuries, but also the leap into electronic
typesetting, remaining essentially unchanged. It was popularised in the 1960s with
the release of Letraset sheets containing Lorem Ipsum passages, and more recently
with desktop publishing software like Aldus PageMaker including versions of Lorem
Ipsum.`

export const VRTState: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <Wrapper>
      <List>
        <dt>hover</dt>
        <dd id="hover">
          <Text>
            <LineClamp maxLines={1} withTooltip>
              {longText}
            </LineClamp>
          </Text>
        </dd>
        <dt>focus</dt>
        <dd id="focus">
          <Text>
            <LineClamp maxLines={1} withTooltip>
              {longText}
            </LineClamp>
          </Text>
        </dd>
        <dt>focusVisible</dt>
        <dd id="focus-visible">
          <Text>
            <LineClamp maxLines={1} withTooltip>
              {longText}
            </LineClamp>
          </Text>
        </dd>
        <dt>active</dt>
        <dd id="active">
          <Text>
            <LineClamp maxLines={1} withTooltip>
              {longText}
            </LineClamp>
          </Text>
        </dd>
      </List>
    </Wrapper>
  </>
)
VRTState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['#hover p'],
    focus: ['#focus p'],
    focusVisible: ['#focus-visible p'],
    active: ['#active p'],
  },
}

export const VRTUserHover: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      ユーザー操作のhoverをシミュレートしてツールチップを表示します
    </VRTInformationPanel>
    <Wrapper>
      <List>
        <dt>hover</dt>
        <dd>
          <Text>
            <LineClamp data-testid="user-hover" maxLines={1} withTooltip>
              {longText}
            </LineClamp>
          </Text>
        </dd>
      </List>
    </Wrapper>
  </>
)
VRTUserHover.play = async ({ canvasElement }) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const canvas = await within(canvasElement)
  const target = await canvas.getByTestId('user-hover')
  await userEvent.hover(target)
}

export const VRTUserFocus: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      ユーザー操作のfocusをシミュレートしてツールチップを表示します
    </VRTInformationPanel>
    <Wrapper>
      <List>
        <dt>focus</dt>
        <dd>
          <Text>
            <LineClamp data-testid="user-focus" maxLines={1} withTooltip>
              {longText}
            </LineClamp>
          </Text>
        </dd>
      </List>
    </Wrapper>
  </>
)
VRTUserFocus.play = async ({ canvasElement }) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const canvas = await within(canvasElement)
  const target = await canvas.getByTestId('user-focus').parentElement! // tabIndexがあるのは親要素
  await target.focus()
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <Wrapper>
      <List>
        <dt>focus</dt>
        <dd>
          <Text>
            <LineClamp data-testid="user-focus" maxLines={1} withTooltip>
              {longText}
            </LineClamp>
          </Text>
        </dd>
      </List>
    </Wrapper>
  </>
)
VRTForcedColors.play = async ({ canvasElement }) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const canvas = await within(canvasElement)
  const target = await canvas.getByTestId('user-focus').parentElement! // tabIndexがあるのは親要素
  await target.focus()
}
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`

const Wrapper = styled.div`
  padding: 24px;
  min-height: 400px;
`
const Text = styled.p`
  width: 400px;
  margin: 0 0 16px;
  font-size: 16px;
`
const List = styled.dl`
  margin: 1rem;
  & > dd {
    margin: 16px 0 40px;
  }
`
