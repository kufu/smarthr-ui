import { Stack } from '../../Layout'
import { DefinitionList } from '../DefinitionList'
import { DefinitionListItem } from '../DefinitionListItem'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/DefinitionList/VRT',
  render: (args) => (
    <Stack>
      {['blockTitle', 'subBlockTitle', 'subSubBlockTitle'].map((termStyleType) =>
        [2, 3, 4].map((maxColumns) => (
          <DefinitionList {...args} key={`${termStyleType}-${maxColumns}`}>
            {[...Array(10)].map((_, i) => (
              <DefinitionListItem
                term={{
                  text: `定義リストアイテム${i + 1}`,
                  styleType: termStyleType as any,
                }}
                maxColumns={maxColumns}
                fullWidth={i === 4}
                key={i}
              >
                定義リストアイテム説明{i + 1}
              </DefinitionListItem>
            ))}
            <DefinitionListItem term="空の定義リストアイテム" />
          </DefinitionList>
        )),
      )}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof DefinitionList>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
