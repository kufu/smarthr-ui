import { Stack } from '../../Layout'
import { RequiredLabel } from '../RequiredLabel'
import { IntlProvider } from '../../../intl'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'States（状態）/RequiredLabel',
  component: RequiredLabel,
  render: (args) => (
    <IntlProvider>
      <RequiredLabel />
    </IntlProvider>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof RequiredLabel>

export const Playground: StoryObj<typeof RequiredLabel> = {
  args: {},
}
