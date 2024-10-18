import { userEvent, within } from '@storybook/test'

import { SearchInput } from '../SearchInput'

import { Width } from './SearchInput.stories'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Forms（フォーム）/SearchInput/VRT',
  render: Width.render,
  args: {
    tooltipMessage: '氏名、ヨミガナ、社員番号で検索できます。スペース区切りでAND検索ができます。',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} as Meta<typeof SearchInput>

const VRT = {}

export const VRTHover: StoryObj<typeof SearchInput> = {
  ...VRT,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: last } = canvas.getAllByRole('textbox')
    await userEvent.hover(last)
  },
}

export const VRTFocus: StoryObj<typeof SearchInput> = {
  ...VRT,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: last } = canvas.getAllByRole('textbox')
    last.focus()
  },
}

export const VRTForcedColors = {
  ...VRTFocus,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
