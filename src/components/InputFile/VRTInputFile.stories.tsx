import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'

import { InputFile } from './InputFile'
import { All } from './InputFile.stories'

export default {
  title: 'Forms（フォーム）/InputFile',
  component: InputFile,
  parameters: {
    withTheming: true,
  },
}

export const VRTState: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <List>
      <dt>hover</dt>
      <dd id="hover">
        <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
        <InputFile name="disabled" label="ファイルを選択" disabled />
        <InputFile name="error" label="ファイルを選択" error />
      </dd>
      <dt>focus</dt>
      <dd id="focus">
        <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
        <InputFile name="disabled" label="ファイルを選択" disabled />
        <InputFile name="error" label="ファイルを選択" error />
      </dd>
      <dt>focus-visible</dt>
      <dd id="focus-visible">
        <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
        <InputFile name="disabled" label="ファイルを選択" disabled />
        <InputFile name="error" label="ファイルを選択" error />
      </dd>
      <dt>focus-within</dt>
      <dd id="focus-within">
        <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
        <InputFile name="disabled" label="ファイルを選択" disabled />
        <InputFile name="error" label="ファイルを選択" error />
      </dd>
      <dt>active</dt>
      <dd id="active">
        <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
        <InputFile name="disabled" label="ファイルを選択" disabled />
        <InputFile name="error" label="ファイルを選択" error />
      </dd>
    </List>
  </>
)
VRTState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: ['#hover span'],
    focus: ['#focus span'],
    focusVisible: ['#focus-visible span'],
    focusWithin: ['#focus-within span'],
    active: ['#active span'],
  },
}

export const VRTForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です" togglable={false}>
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const List = styled.dl`
  margin: 1rem;

  & > dt {
    margin-bottom: 0.5rem;
  }

  & > dd {
    margin: 0 0 1rem;
    display: flex;
    gap: 1rem;
  }
`
const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
