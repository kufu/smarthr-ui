import { Stack } from '../../Layout'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Accordion/VRT',
  render: () => (
    <Stack>
      {['left', 'right'].map((iconPosition) => (
        <Accordion
          key={iconPosition}
          iconPosition={iconPosition as any}
          defaultExpanded={['item-left-screenTitle', 'item-right-screenTitle']}
        >
          {['screenTitle', 'sectionTitle', 'blockTitle', 'subBlockTitle', 'subSubBlockTitle'].map(
            (headingType) => (
              <AccordionItem
                key={`${iconPosition}${headingType}`}
                name={`item-${iconPosition}-${headingType}`}
              >
                <AccordionTrigger
                  headingType={headingType as any}
                >{`アコーディオンパネル ${iconPosition} ${headingType}`}</AccordionTrigger>
                <AccordionContent>{`アコーディオンパネルコンテンツ ${iconPosition} ${headingType}`}</AccordionContent>
              </AccordionItem>
            ),
          )}
          <AccordionItem name="disabled">
            <AccordionTrigger disabled>disabled なアコーディオンパネル</AccordionTrigger>
            <AccordionContent>アコーディオンパネルコンテンツ</AccordionContent>
          </AccordionItem>
          <AccordionItem name="long-trigger-name">
            <AccordionTrigger>
              Chromatic環境では必ず折り返されるほど長いアコーディオンパネルトリガー名を持つアコーディオンパネルを作るために試行錯誤の結果生まれたアコーディオンパネルトリガー名
            </AccordionTrigger>
            <AccordionContent>アコーディオンパネルコンテンツ</AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
      <Accordion rounded="all">
        {[...Array(2)].map((_, i) => (
          <AccordionItem key={i + 1} name={`accordion-panel-${i + 1}`}>
            <AccordionTrigger>アコーディオンパネル{i + 1}</AccordionTrigger>
            <AccordionContent>アコーディオンパネルコンテンツ{i + 1}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Accordion>

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
