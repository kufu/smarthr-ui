import { EnvironmentProvider } from '../useEnvironment'

import { type VariantProps, defineSV, useSV } from './useSV'

import type { Meta, StoryFn } from '@storybook/react-webpack5'
import type { FC } from 'react'

const sv = defineSV(({ mobile }) => ({
  base: {
    box: ['shr-size-8', mobile && 'shr-size-4 shr-rounded-full'],
  },
  variants: {
    color: {
      default: {
        box: 'shr-bg-column',
      },
      main: {
        box: 'shr-bg-main',
      },
    },
  },
}))

type Props = VariantProps<typeof sv>

const Component: FC<Props> = ({ color = 'main' }) => {
  const { box } = useSV(sv, { color })
  return <div className={box} />
}

export default {
  title: 'Hooks/useSV',
  decorators: [
    (Story) => (
      <EnvironmentProvider>
        <Story />
      </EnvironmentProvider>
    ),
  ],
} satisfies Meta<typeof useSV>

export const Default: StoryFn = () => <Component />
