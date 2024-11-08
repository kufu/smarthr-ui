import React from 'react'

import { Stack } from '../../Layout'
import { AccordionPanel } from '../AccordionPanel'
import { AccordionPanelContent } from '../AccordionPanelContent'
import { AccordionPanelItem } from '../AccordionPanelItem'
import { AccordionPanelTrigger } from '../AccordionPanelTrigger'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/AccordionPanel/VRT',
  render: () => (
    <Stack>
      {['left', 'right'].map((iconPosition) => (
        <AccordionPanel
          key={iconPosition}
          iconPosition={iconPosition as any}
          defaultExpanded={['item-left-screenTitle', 'item-right-screenTitle']}
        >
          {['screenTitle', 'sectionTitle', 'blockTitle', 'subBlockTitle', 'subSubBlockTitle'].map(
            (headingType) => (
              <AccordionPanelItem
                name={`item-${iconPosition}-${headingType}`}
                key={`${iconPosition}${headingType}`}
              >
                <AccordionPanelTrigger
                  headingType={headingType as any}
                >{`アコーディオンパネル ${iconPosition} ${headingType}`}</AccordionPanelTrigger>
                <AccordionPanelContent>{`アコーディオンパネルコンテンツ ${iconPosition} ${headingType}`}</AccordionPanelContent>
              </AccordionPanelItem>
            ),
          )}
          <AccordionPanelItem name="disabled">
            <AccordionPanelTrigger disabled>disabled なアコーディオンパネル</AccordionPanelTrigger>
            <AccordionPanelContent>アコーディオンパネルコンテンツ</AccordionPanelContent>
          </AccordionPanelItem>
          <AccordionPanelItem name="long-trigger-name">
            <AccordionPanelTrigger>
              Chromatic環境では必ず折り返されるほど長いアコーディオンパネルトリガー名を持つアコーディオンパネルを作るために試行錯誤の結果生まれたアコーディオンパネルトリガー名
            </AccordionPanelTrigger>
            <AccordionPanelContent>アコーディオンパネルコンテンツ</AccordionPanelContent>
          </AccordionPanelItem>
        </AccordionPanel>
      ))}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof AccordionPanel>

export const VRT = {
  parameters: {
    pseudo: {
      hover: ['#item-left-sectionTitle-trigger', '#item-right-sectionTitle-trigger'],
      focusVisible: ['#item-left-blockTitle-trigger', '#item-right-blockTitle-trigger'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
