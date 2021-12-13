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
