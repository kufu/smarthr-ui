import { Story } from '@storybook/react'
import * as React from 'react'

import { BottomFixedArea } from './BottomFixedArea'
import { PrimaryButton, SecondaryButton } from '../Button'
import { FaTrashIcon } from '../Icon/'
import { action } from '@storybook/addon-actions'
import readme from './README.md'

export default {
  title: 'BottomFixedArea',
  component: BottomFixedArea,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const _BottomFixedArea: Story = () => {
  return (
    <BottomFixedArea
      description="This is description."
      primaryButton={<PrimaryButton>Primary Button</PrimaryButton>}
      secondaryButton={<SecondaryButton>Secondary Button</SecondaryButton>}
      tertiaryLinks={[{ text: 'Tertiary_1', icon: FaTrashIcon, onClick: action('click_1') }]}
    />
  )
}
_BottomFixedArea.storyName = 'BottomFixedArea'

export const MobileViewport: Story = () => {
  return (
    <BottomFixedArea
      description="This is description."
      primaryButton={<PrimaryButton>Primary Button</PrimaryButton>}
      secondaryButton={<SecondaryButton>Secondary Button</SecondaryButton>}
      tertiaryLinks={[
        { text: 'Tertiary_1', icon: FaTrashIcon, onClick: action('click_1') },
        { text: 'Tertiary_2', icon: FaTrashIcon, onClick: action('click_2') },
        { text: 'Tertiary_3', icon: FaTrashIcon, onClick: action('click_3') },
        { text: 'Tertiary_4', icon: FaTrashIcon, onClick: action('click_4') },
      ]}
    />
  )
}
MobileViewport.parameters = {
  viewport: {
    defaultViewport: 'iphone5',
  },
}
