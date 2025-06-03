import { userEvent } from '@storybook/test'

import { FaCircleQuestionIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Tooltip } from '../Tooltip'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Tooltip/VRT',
  render: (args) => (
    <Stack gap={8} align="flex-start" className="shr-p-4">
      <Tooltip {...args} triggerType="icon">
        <FaCircleQuestionIcon alt="ツールチップ" />
      </Tooltip>
      <Tooltip
        {...args}
        message={
          <>
            複数行の
            <br />
            メッセージ
          </>
        }
      />
      <div className="shr-w-[5em]">
        <Tooltip {...args} ellipsisOnly>
          <span className="shr-inline-block shr-max-w-full shr-overflow-hidden shr-text-ellipsis shr-text-nowrap">
            省略されるメッセージ
          </span>
        </Tooltip>
      </div>
    </Stack>
  ),
  args: {
    message: 'ツールチップ',
    children: 'ツールチップ',
    vertical: 'auto',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: ({ canvasElement }) => {
    const tooltips = canvasElement.querySelectorAll('.smarthr-ui-Tooltip')
    tooltips.forEach((tooltip) => userEvent.hover(tooltip))
  },
  tags: ['!autodocs'],
} as Meta<typeof Tooltip>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
