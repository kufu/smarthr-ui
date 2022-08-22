import { Story } from '@storybook/react'
import * as React from 'react'

import { FloatArea } from './FloatArea'
import { Button } from '../Button'
import { FaExclamationCircleIcon } from '../Icon'

export default {
  title: 'FloatArea',
  component: FloatArea,
}

export const All: Story = () => (
  <FloatArea
    primaryButton={<Button variant="primary">Submit</Button>}
    secondaryButton={<Button>Cancel</Button>}
    tertiaryButton={<Button>preview</Button>}
    errorIcon={<FaExclamationCircleIcon color="DANGER" />}
    errorText="This is the error text."
    width="80%"
    top={32}
  />
)
All.storyName = 'all'

export const WithoutTertiary: Story = () => (
  <FloatArea
    primaryButton={<Button variant="primary">Submit</Button>}
    secondaryButton={<Button>Cancel</Button>}
    errorIcon={<FaExclamationCircleIcon color="DANGER" />}
    errorText="This is the error text."
    width="80%"
    bottom="24px"
  />
)
WithoutTertiary.storyName = 'withoutTertiary'

export const OnlyPrimary: Story = () => (
  <FloatArea primaryButton={<Button variant="primary">Submit</Button>} top={32} />
)
OnlyPrimary.storyName = 'onlyPrimary'
