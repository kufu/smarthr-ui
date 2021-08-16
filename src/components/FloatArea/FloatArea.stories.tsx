import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { FloatArea } from './FloatArea'
import { PrimaryButton, SecondaryButton } from '../Button'
import { FaExclamationTriangleIcon } from '../Icon'

import readme from './README.md'

storiesOf('FloatArea', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('all', () => (
    <FloatArea
      primaryButton={<PrimaryButton>Submit</PrimaryButton>}
      secondaryButton={<SecondaryButton>Cancel</SecondaryButton>}
      tertiaryButton={<SecondaryButton>preview</SecondaryButton>}
      errorIcon={<FaExclamationTriangleIcon color="#e01e5a" />}
      errorText="This is the error text."
      width="80%"
      top={40}
    />
  ))
  .add('withoutTertiary', () => (
    <FloatArea
      primaryButton={<PrimaryButton>Submit</PrimaryButton>}
      secondaryButton={<SecondaryButton>Cancel</SecondaryButton>}
      errorIcon={<FaExclamationTriangleIcon color="#e01e5a" />}
      errorText="This is the error text."
      width="80%"
      top={40}
    />
  ))
  .add('onlyPrimary', () => (
    <FloatArea primaryButton={<PrimaryButton>Submit</PrimaryButton>} top={40} />
  ))
