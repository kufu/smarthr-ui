import { userEvent, within } from 'storybook/test'

import { FaRegCircleQuestionIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Header } from '../Header'
import { HeaderLink } from '../HeaderLink'
import { LanguageSwitcher } from '../LanguageSwitcher'

import { _appsOptions } from './Header.stories'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Header/VRT',
  render: (args) => (
    <Stack className="shr-h-screen">
      {[undefined, 'focus-visible'].map((id) => (
        <Stack key={id} id={id}>
          {[false, true].map((enableNew) => (
            <Header {...args} key={String(enableNew)} enableNew={enableNew}>
              <HeaderLink
                href="https://smarthr.design/"
                enableNew={enableNew}
                prefix={<FaRegCircleQuestionIcon />}
              >
                ヘルプ
              </HeaderLink>
              <LanguageSwitcher
                localeMap={{
                  ja: '日本語',
                  'en-us': 'English',
                }}
                enableNew={enableNew}
              />
            </Header>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    featureName: '基本機能',
    apps: _appsOptions.あり,
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Header>

export const VRT = {
  parameters: {
    pseudo: {
      focusVisible: ['#focus-visible a', '#focus-visible button'],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const { length, [length - 1]: last } = await canvas.findAllByRole('button', {
      name: /基本機能/,
    })
    userEvent.click(last)
  },
} satisfies Meta<typeof Header>

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
