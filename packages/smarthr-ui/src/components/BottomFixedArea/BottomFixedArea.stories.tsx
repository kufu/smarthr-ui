import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'

import { Button } from '../Button'
import { FaBoxArchiveIcon, FaTrashIcon } from '../Icon'

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

export const _BottomFixedArea: StoryFn = () => (
  <BottomFixedArea
    description="申請内容を入力し、送信してください。"
    primaryButton={<Button variant="primary">送信</Button>}
    secondaryButton={<Button>キャンセル</Button>}
    tertiaryLinks={[
      { text: '削除', icon: FaTrashIcon, onClick: action('click_1') },
      {
        text: <span>アーカイブ</span>,
        icon: FaBoxArchiveIcon,
        onClick: action('click_2'),
      },
    ]}
  />
)
_BottomFixedArea.storyName = 'BottomFixedArea'
