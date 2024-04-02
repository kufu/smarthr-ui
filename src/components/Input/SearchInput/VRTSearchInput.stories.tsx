import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import * as React from 'react'
import styled, { css } from 'styled-components'

import { InformationPanel } from '../../InformationPanel'

import { SearchInput } from './SearchInput'

export default {
  title: 'Forms（フォーム）/Input',
  component: SearchInput,
  parameters: {
    withTheming: true,
  },
}

const SearchInputStory: StoryFn = () => (
  <Wrapper>
    <p>主に入力欄に対する説明をレイアウト上配置できない場合の利用を想定しています。</p>
    <SearchInput
      name="default"
      tooltipMessage="氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。"
    />
  </Wrapper>
)

export const VRTHoverSearchInput: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hoverしてツールチップを表示した状態で表示されます
    </VRTInformationPanel>
    <SearchInputStory />
  </>
)
const playHover = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const input = canvas.getAllByRole('textbox')
  await userEvent.hover(input[0])
}
VRTHoverSearchInput.play = playHover

export const VRTFocusSearchInput: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      focusしてツールチップを表示した状態で表示されます
    </VRTInformationPanel>
    <SearchInputStory />
  </>
)
VRTFocusSearchInput.play = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  await canvas.getAllByRole('textbox')[0].focus()
}

export const VRTHoverSearchInputForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <SearchInputStory />
  </>
)
VRTHoverSearchInputForcedColors.play = playHover
VRTHoverSearchInputForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const Wrapper = styled.div`
  ${({ theme: { space } }) => css`
    padding: ${space(2)};
  `}
`
const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
