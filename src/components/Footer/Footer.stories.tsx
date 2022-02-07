import React from 'react'
import { Story } from '@storybook/react'
import readme from './README.md'

import { Footer } from './Footer'

export default {
  title: 'Footer',
  component: Footer,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => <Footer />
All.storyName = 'all'
