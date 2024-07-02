import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { FormControl } from '../FormControl'
import { InformationPanel } from '../InformationPanel'
import { Cluster, Stack } from '../Layout'

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
    <VRTInformationPanel title="VRT 用の Story です">
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <Stack>
      <FormControl title="hover" id="hover" role="group">
        <Cluster>
          <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
          <InputFile name="disabled" label="ファイルを選択" disabled />
          <InputFile name="error" label="ファイルを選択" error />
        </Cluster>
      </FormControl>
      <FormControl title="focus" id="focus" role="group">
        <Cluster>
          <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
          <InputFile name="disabled" label="ファイルを選択" disabled />
          <InputFile name="error" label="ファイルを選択" error />
        </Cluster>
      </FormControl>
      <FormControl title="focus-visible" id="focus-visible" role="group">
        <Cluster>
          <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
          <InputFile name="disabled" label="ファイルを選択" disabled />
          <InputFile name="error" label="ファイルを選択" error />
        </Cluster>
      </FormControl>
      <FormControl title="focus-within" id="focus-within" role="group">
        <Cluster>
          <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
          <InputFile name="disabled" label="ファイルを選択" disabled />
          <InputFile name="error" label="ファイルを選択" error />
        </Cluster>
      </FormControl>
      <FormControl title="active" id="active" role="group">
        <Cluster>
          <InputFile name="default" label="ファイルを選択" onChange={action('onChange')} multiple />
          <InputFile name="disabled" label="ファイルを選択" disabled />
          <InputFile name="error" label="ファイルを選択" error />
        </Cluster>
      </FormControl>
    </Stack>
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
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <All />
  </>
)
VRTForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
