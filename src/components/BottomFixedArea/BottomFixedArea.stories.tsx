import { action } from '@storybook/addon-actions'
import { Story } from '@storybook/react'
import * as React from 'react'

import { Button } from '../Button'
import { FaTrashIcon } from '../Icon'

import { BottomFixedArea } from './BottomFixedArea'

export default {
  title: 'Navigation（ナビゲーション）/BottomFixedArea',
  component: BottomFixedArea,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
        iframeHeight: '500px',
      },
    },
  },
}

export const _BottomFixedArea: Story = () => (
  <BottomFixedArea
    description="This is description."
    primaryButton={<Button variant="primary">Primary Button</Button>}
    secondaryButton={<Button>Secondary Button</Button>}
    tertiaryLinks={[
      { text: 'Tertiary_1', icon: FaTrashIcon, onClick: action('click_1') },
      { text: 'Tertiary_2', icon: FaTrashIcon, onClick: action('click_2') },
      { text: 'Tertiary_3', icon: FaTrashIcon, onClick: action('click_3') },
      {
        text: <span>Tertiary_4</span>,
        icon: FaTrashIcon,
        onClick: action('click_4'),
      },
    ]}
  />
)
_BottomFixedArea.storyName = 'BottomFixedArea'
