import { Story } from '@storybook/react'
import * as React from 'react'

import { FloatArea } from './FloatArea'
import { Button } from '../Button'
import { FaExclamationCircleIcon } from '../Icon'

import readme from './README.md'

export default {
  title: 'FloatArea',
  component: FloatArea,
  parameters: {
    readme: {
      sidebar: readme,
    },
  },
}

export const All: Story = () => (
  <FloatArea
    primaryButton={<Button variant="primary">Submit</Button>}
    secondaryButton={<Button>Cancel</Button>}
    tertiaryButton={<Button>preview</Button>}
    errorIcon={<FaExclamationCircleIcon color="#e01e5a" />}
    errorText="This is the error text."
    width="80%"
    top={40}
  />
)
All.storyName = 'all'

export const WithoutTertiary: Story = () => (
  <FloatArea
    primaryButton={<Button variant="primary">Submit</Button>}
    secondaryButton={<Button>Cancel</Button>}
    errorIcon={<FaExclamationCircleIcon color="#e01e5a" />}
    errorText="This is the error text."
    width="80%"
    top={40}
  />
)
WithoutTertiary.storyName = 'withoutTertiary'

export const OnlyPrimary: Story = () => (
  <FloatArea primaryButton={<Button variant="primary">Submit</Button>} top={40} />
)
OnlyPrimary.storyName = 'onlyPrimary'
