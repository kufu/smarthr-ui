import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
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

export const VRTUserHover: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      ユーザー操作のhoverをシミュレートしてツールチップを表示します
    </VRTInformationPanel>
    <Wrapper>
      <List>
        <dt>hover</dt>
        <dd>
          <Text>
            <LineClamp data-testid="user-hover" maxLines={1}>
              {longText}
            </LineClamp>
          </Text>
        </dd>
      </List>
    </Wrapper>
  </>
)
VRTUserHover.play = async ({ canvasElement }) => {
  await new Promise((resolve) => setTimeout(resolve, 500)) // スナップショット時にツールチップを確実に表示させるため
  const canvas = await within(canvasElement)
  const target = await canvas.getByTestId('user-hover')
  await userEvent.hover(target)
}

export const VRTUserFocus: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      ユーザー操作のfocusをシミュレートしてツールチップを表示します
    </VRTInformationPanel>
    <Wrapper>
      <List>
        <dt>focus</dt>
        <dd>
          <Text>
            <LineClamp data-testid="user-focus" maxLines={1}>
              {longText}
            </LineClamp>
          </Text>
        </dd>
      </List>
    </Wrapper>
  </>
)
VRTUserFocus.play = async ({ canvasElement }) => {
  await new Promise((resolve) => setTimeout(resolve, 500)) // スナップショット時にツールチップを確実に表示させるため
  const canvas = await within(canvasElement)
  const target = await canvas.getByTestId('user-focus').parentElement! // tabIndexがあるのは親要素
  await target.focus()
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <Wrapper>
      <List>
        <dt>focus</dt>
        <dd>
          <Text>
            <LineClamp data-testid="user-focus" maxLines={1}>
              {longText}
            </LineClamp>
          </Text>
        </dd>
      </List>
    </Wrapper>
  </>
)
VRTForcedColors.play = async ({ canvasElement }) => {
  await new Promise((resolve) => setTimeout(resolve, 500)) // スナップショット時にツールチップを確実に表示させるため
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

// min-heightで高さを確保しているのは、スナップショット時にツールチップが表示されるようにするため
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
