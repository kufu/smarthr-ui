import Story, { Data } from './SpreadsheetTable.stories'

import type { SpreadsheetTable } from '../SpreadsheetTable'
import type { Meta, StoryObj } from '@storybook/react-webpack5'


export default {
  title: 'Components/SpreadsheetTable/VRT',
  /* ペアワイズ法による網羅 */
  render: Story.render,
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof SpreadsheetTable>

export const VRT = {
  args: Data.args,
}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
