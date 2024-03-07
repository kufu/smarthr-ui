import { StoryFn } from '@storybook/react'
import React from 'react'

import { CompactInformationPanel } from '../CompactInformationPanel'
import { TextLink } from '../TextLink'

import { FormGroup } from './FormGroup'

export default {
  title: 'Forms（フォーム）/FormGroup（非推奨）',
  component: FormGroup,
}

export const All: StoryFn = () => (
  <CompactInformationPanel type="warning">
    FormGroupコンポーネントは非推奨です。
    <TextLink href="/?path=/docs/forms（フォーム）-formcontrol--docs">FormControl</TextLink>か
    <TextLink href="/?path=/docs/forms（フォーム）-fieldset--docs">Fieldset</TextLink>
    コンポーネントを使用してください。
  </CompactInformationPanel>
)
All.storyName = 'all'
