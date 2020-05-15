import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { BottomFixedArea } from './BottomFixedArea'
import { PrimaryButton, SecondaryButton } from '../Button'
import { action } from '@storybook/addon-actions'

storiesOf('BottomFixedArea', module).add('BottomFixedArea', () => (
  <BottomFixedArea
    description="This is description."
    primaryButton={<PrimaryButton>Primary Button</PrimaryButton>}
    secondaryButton={<SecondaryButton>Secondary Button</SecondaryButton>}
    tertiaryLinks={[{ text: 'tertiary_1', iconName: 'fa-trash', onClick: action('click_1') }]}
  />
))
