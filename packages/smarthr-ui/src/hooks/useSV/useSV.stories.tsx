import { Meta, StoryFn } from '@storybook/react'
import { defineSV, useSV, VariantProps } from './useSV'
import { EnvironmentProvider } from '../useEnvironment'
import { FC } from 'react'

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

const Component: FC<Props> = ({ color }) => {
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
