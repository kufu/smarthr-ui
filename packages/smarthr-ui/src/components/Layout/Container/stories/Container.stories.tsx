import { Base } from '../../../Base'
import { Container, classNameGenerator } from '../Container'

import type { Meta, StoryFn, StoryObj } from '@storybook/react'
import { ComponentProps, useLayoutEffect, useRef, useState } from 'react'
import { Stack } from '../../Stack'
import { DeviceProvider } from '../../../..'

const Template: StoryFn<typeof Container> = ({ size, children, ...rest }) => (
  <Container {...rest} size={size}>
    <DisplayDimensionsBase padding={1.5} size={size}>
      Story をわかりやすくするためのカスタム Base
    </DisplayDimensionsBase>
  </Container>
)

export default {
  title: 'Components/Layout/Container',
  component: Container,
  render: Template,
  decorators: [
    (Story) => (
      <DeviceProvider>
        <Story />
      </DeviceProvider>
    ),
  ],
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Container>

export const Playground: StoryObj<typeof Container> = {}

export const Size: StoryObj<typeof Container> = {
  name: 'size',
  render: (args, context) => (
    <Stack>
      {[undefined, ...Object.keys(classNameGenerator.variants.size)].map((size) =>
        Template({ ...args, size: size as any }, context),
      )}
    </Stack>
  ),
}

export const Padding: StoryObj<typeof Container> = {
  name: 'padding',
  args: {
    padding: {
      block: 2,
      inline: 1.5,
      narrowModeBlock: 1.5,
      narrowModeInline: 0,
    },
  },
}

const DisplayDimensionsBase: React.FC<
  ComponentProps<typeof Base> & Pick<ComponentProps<typeof Container>, 'size'>
> = ({ children, size, ...rest }) => {
  const target = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0 })

  const testDimensions = () => {
    if (target.current) {
      setDimensions({
        width: target.current.offsetWidth,
      })
    }
  }
  useLayoutEffect(() => {
    testDimensions()
  }, [])

  useLayoutEffect(() => {
    let moveTimer: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(moveTimer)
      moveTimer = setTimeout(testDimensions, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(moveTimer)
    }
  })

  return (
    <Base {...rest} ref={target}>
      コンテナ{size}: {dimensions.width}px
    </Base>
  )
}
