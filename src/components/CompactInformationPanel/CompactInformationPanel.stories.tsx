import { StoryFn } from '@storybook/react'
import React from 'react'

import { Stack } from '../Layout'

import { CompactInformationPanel } from '.'

export default {
  title: 'Data Display（データ表示）/CompactInformationPanel（非推奨）',
  component: CompactInformationPanel,
}

export const Default: StoryFn = () => (
  <CompactInformationPanel>
    CompactInformationPanel
    は画面内の操作を進めるにあたってユーザーに伝えるべきメッセージを表示する領域です。
    <br />
    InformationPanel とは異なり、パネルを閉じることはできません。
  </CompactInformationPanel>
)
export const Type: StoryFn = () => (
  <Stack>
    <CompactInformationPanel type="info">
      これは [type=info] の CompactInformationPanel です。
      <br />
      type を省略した場合も [type=info] になります。
    </CompactInformationPanel>
    <CompactInformationPanel type="success">
      これは [type=success] の CompactInformationPanel です。
    </CompactInformationPanel>
    <CompactInformationPanel type="warning">
      これは [type=warning] の CompactInformationPanel です。
    </CompactInformationPanel>
    <CompactInformationPanel type="error">
      これは [type=error] の CompactInformationPanel です。
    </CompactInformationPanel>
  </Stack>
)
