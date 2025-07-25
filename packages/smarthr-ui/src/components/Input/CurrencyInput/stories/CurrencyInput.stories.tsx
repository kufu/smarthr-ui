import { FaMoneyCheckDollarIcon } from '../../../Icon'
import { CurrencyInput } from '../CurrencyInput'

import type { Meta, StoryObj } from '@storybook/react'

const _prefixOptions = {
  なし: undefined,
  string: '￥',
  ReactNode: <FaMoneyCheckDollarIcon />,
}

const _suffixOptions = {
  なし: undefined,
  string: '円',
  ReactNode: <FaMoneyCheckDollarIcon />,
}

export default {
  title: 'Components/Input/CurrencyInput',
  component: CurrencyInput,
  render: (args) => <CurrencyInput {...args} />,
  argTypes: {
    prefix: {
      control: 'radio',
      options: Object.keys(_prefixOptions),
      mapping: _prefixOptions,
    },
    suffix: {
      control: 'radio',
      options: Object.keys(_suffixOptions),
      mapping: _suffixOptions,
    },
  },
  args: {
    defaultValue: '999999999',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof CurrencyInput>

export const Playground: StoryObj<typeof CurrencyInput> = {}
