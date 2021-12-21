import { Story } from '@storybook/react'
import * as React from 'react'

import { FloatArea } from './FloatArea'
import { PrimaryButton, SecondaryButton } from '../Button'
import { FaExclamationTriangleIcon } from '../Icon'

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
    primaryButton={<PrimaryButton>Submit</PrimaryButton>}
    secondaryButton={<SecondaryButton>Cancel</SecondaryButton>}
    tertiaryButton={<SecondaryButton>preview</SecondaryButton>}
    errorIcon={<FaExclamationTriangleIcon color="#e01e5a" />}
    errorText="This is the error text."
    width="80%"
    top={40}
  />
)
All.storyName = 'all'

export const WithoutTertiary: Story = () => (
  <FloatArea
    primaryButton={<PrimaryButton>Submit</PrimaryButton>}
    secondaryButton={<SecondaryButton>Cancel</SecondaryButton>}
    errorIcon={<FaExclamationTriangleIcon color="#e01e5a" />}
    errorText="This is the error text."
    width="80%"
    top={40}
  />
)
WithoutTertiary.storyName = 'withoutTertiary'

export const OnlyPrimary: Story = () => (
  <FloatArea primaryButton={<PrimaryButton>Submit</PrimaryButton>} top={40} />
)
OnlyPrimary.storyName = 'onlyPrimary'
