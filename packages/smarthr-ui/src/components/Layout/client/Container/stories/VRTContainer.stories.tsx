import { Size } from './Container.stories'

import type { Container } from '../Container'
import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Components/Layout/Container/VRT',
  render: Size.render,
  globals: {
    viewport: { value: 'vrtWide' },
  },
  parameters: {
    chromatic: { disableSnapshot: false },
    viewport: {
      options: {
        vrtWide: {
          name: 'VRT Wide',
          styles: {
            width: '2048px',
            height: '900px',
          },
        },
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Container>

export const VRT = {}
