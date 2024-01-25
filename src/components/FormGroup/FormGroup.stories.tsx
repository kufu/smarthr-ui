import { StoryFn } from '@storybook/react'
import React from 'react'

import { CompactInformationPanel } from '../CompactInformationPanel'

export default {
  title: 'Forms（フォーム）/FormGroup（非推奨）',
  component: FormGroup,
}

export const All: StoryFn = () => (
  <CompactInformationPanel type="warning">
    FormGroupコンポーネントは非推奨です。
    <a href="/?path=/docs/forms（フォーム）-formcontrol--docs">FormControl</a>か
    <a href="/?path=/docs/forms（フォーム）-fieldset--docs">Fieldset</a>
    コンポーネントを使用してください。
  </CompactInformationPanel>
)
All.storyName = 'all'
