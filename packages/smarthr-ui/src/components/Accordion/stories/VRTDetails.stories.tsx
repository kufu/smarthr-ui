import { Stack } from '../../Layout'
import { Details } from '../Details'
import { DetailsContent } from '../DetailsContent'
import { DetailsItem } from '../DetailsItem'
import { Summary } from '../Summary'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Details/VRT',
  render: () => (
    <Stack>
      {['left', 'right'].map((iconPosition) => (
        <Details
          key={iconPosition}
          iconPosition={iconPosition as any}
          defaultExpanded={['item-left-screenTitle', 'item-right-screenTitle']}
        >
          {['screenTitle', 'sectionTitle', 'blockTitle', 'subBlockTitle', 'subSubBlockTitle'].map(
            (headingType) => (
              <DetailsItem
                name={`item-${iconPosition}-${headingType}`}
                key={`${iconPosition}${headingType}`}
              >
                <Summary
                  headingType={headingType as any}
                >{`アコーディオンパネル ${iconPosition} ${headingType}`}</Summary>
                <DetailsContent>{`アコーディオンパネルコンテンツ ${iconPosition} ${headingType}`}</DetailsContent>
              </DetailsItem>
            ),
          )}
          <DetailsItem name="disabled">
            <Summary disabled>disabled なアコーディオンパネル</Summary>
            <DetailsContent>アコーディオンパネルコンテンツ</DetailsContent>
          </DetailsItem>
          <DetailsItem name="long-trigger-name">
            <Summary>
              Chromatic環境では必ず折り返されるほど長いアコーディオンパネルトリガー名を持つアコーディオンパネルを作るために試行錯誤の結果生まれたアコーディオンパネルトリガー名
            </Summary>
            <DetailsContent>アコーディオンパネルコンテンツ</DetailsContent>
          </DetailsItem>
        </Details>
      ))}
      <Details rounded="all">
        {[...Array(2)].map((_, i) => (
          <DetailsItem key={i + 1} name={`accordion-panel-${i + 1}`}>
            <Summary>アコーディオンパネル{i + 1}</Summary>
            <DetailsContent>アコーディオンパネルコンテンツ{i + 1}</DetailsContent>
          </DetailsItem>
        ))}
      </Details>
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof Details>

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
