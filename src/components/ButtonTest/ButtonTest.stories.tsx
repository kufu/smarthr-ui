import { action } from '@storybook/addon-actions'
import * as React from 'react'
import { PrimaryButton, PrimaryButtonAnchor } from './PrimaryButton'
import { SecondaryButton } from './SecondaryButton'
import { DangerButton } from './DangerButton'
import { Icon } from '../Icon'
import { Story } from '@storybook/react'

export default {
  title: 'ButtonTest/Button(CSF)',
  component: PrimaryButton,
  subcomponents: { PrimaryButtonAnchor, SecondaryButton, DangerButton },
  argTypes: {
    prefix: { control: false },
    suffix: { control: false },
  },
}
const Template: Story<React.ComponentProps<typeof PrimaryButton>> = (args) => (
  <>
    <PrimaryButton onClick={action('clicked')} {...args}>
      {args.children ?? 'Button'}
    </PrimaryButton>
    <SecondaryButton onClick={action('clicked')} {...args}>
      {args.children ?? 'SecondaryButton'}
    </SecondaryButton>
    <DangerButton onClick={action('clicked')} {...args}>
      {args.children ?? 'DangerButton'}
    </DangerButton>
    {/* @ts-expect-error */}
    <PrimaryButtonAnchor href="#" {...args}>
      {args.children ?? 'Anchor'}
    </PrimaryButtonAnchor>
    <PrimaryButton disabled={true} {...args}>
      {args.children ?? 'Disabled'}
    </PrimaryButton>
  </>
)

export const Default = Template.bind({})
Default.args = {}

export const WithIcon = Template.bind({})
WithIcon.args = {
  prefix: <Icon size={14} name="fa-plus-circle" />,
}
WithIcon.parameters = {
  docs: {
    description: {
      story: 'You can put an icon before the label text',
    },
  },
}

export const WithIconRight = Template.bind({})
WithIconRight.args = {
  suffix: <Icon size={14} name="fa-plus-circle" />,
}
WithIconRight.parameters = {
  docs: {
    description: {
      story: 'You can put an icon after the label text',
    },
  },
}

export const OnlyIcon = Template.bind({})
OnlyIcon.args = {
  square: true,
  children: <Icon size={16} name="fa-plus-circle" />,
}
OnlyIcon.parameters = {
  docs: {
    description: {
      story: 'This is an icon button',
    },
  },
}
