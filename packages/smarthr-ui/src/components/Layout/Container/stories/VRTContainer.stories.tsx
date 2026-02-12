import { Size } from './Container.stories'

import type { Container } from '../Container'
import type { Meta } from '@storybook/react-webpack5'

export default {
  title: 'Components/Layout/Container/VRT',
  render: Size.render,
  parameters: {
    chromatic: { disableSnapshot: false },
    viewport: {
      defaultViewport: 'vrtWide',
      viewports: {
        vrtWide: {
          name: 'VRT Wide',
          styles: {
            width: '2048px',
          },
        },
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Container>

export const VRT = {}
