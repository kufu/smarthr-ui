import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { PrimaryButton, PrimaryButtonAnchor } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { DangerButton } from './DangerButton'
import { Icon } from '../Icon'
export default {
  title: 'ButtonTest/CSF',
  component: PrimaryButton,
  subcomponents: { SecondaryButton, DangerButton },
  parameters: {
    docs: {
      description: {
        component: 'this is an awesome button!!',
      },
    },
  },
}
export const Default = () => (
  <>
    <PrimaryButton onClick={action('clicked')}>Button</PrimaryButton>
    <PrimaryButtonAnchor href="#">Anchor</PrimaryButtonAnchor>
    <PrimaryButton disabled={true}>Disabled</PrimaryButton>
  </>
)
export const WithIcon = () => (
  <>
    <p>With icon (Left)</p>
    <PrimaryButton prefix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
      Button
    </PrimaryButton>
    <PrimaryButtonAnchor prefix={<Icon size={14} name="fa-plus-circle" />} href="#">
      Anchor
    </PrimaryButtonAnchor>
    <PrimaryButton prefix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
      Disabled
    </PrimaryButton>
  </>
)
WithIcon.parameters = {
  docs: {
    description: {
      story: 'you can use this button with an icon',
    },
  },
}
export const WithIconLeft = () => (
  <>
    <PrimaryButton prefix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
      Button
    </PrimaryButton>
    <PrimaryButtonAnchor prefix={<Icon size={14} name="fa-plus-circle" />} href="#">
      Anchor
    </PrimaryButtonAnchor>
    <PrimaryButton prefix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
      Disabled
    </PrimaryButton>
  </>
)
export const WithIconRight = () => (
  <>
    <PrimaryButton suffix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
      Button
    </PrimaryButton>
    <PrimaryButtonAnchor suffix={<Icon size={14} name="fa-plus-circle" />} href="#">
      Anchor
    </PrimaryButtonAnchor>
    <PrimaryButton suffix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
      Disabled
    </PrimaryButton>
  </>
)
export const OnlyIcon = () => (
  <>
    <PrimaryButton onClick={action('clicked')} square>
      <Icon size={16} name="fa-plus-circle" />
    </PrimaryButton>
    <PrimaryButtonAnchor href="#" square>
      <Icon size={16} name="fa-plus-circle" />
    </PrimaryButtonAnchor>
    <PrimaryButton disabled={true} square>
      <Icon size={16} name="fa-plus-circle" />
    </PrimaryButton>
  </>
)
