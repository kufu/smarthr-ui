import { Story } from '@storybook/react'
import React from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'

import {
  DangerButton,
  DangerButtonAnchor,
  PrimaryButton,
  PrimaryButtonAnchor,
  SecondaryButton,
  SecondaryButtonAnchor,
  SkeletonButton,
  SkeletonButtonAnchor,
  TextButton,
  TextButtonAnchor,
} from '.'
import { FaPlusCircleIcon } from '../Icon'

import readme from './README.md'
import { RegStory } from './Reg.stories'

export default {
  title: 'Button',
  component: PrimaryButton,
  subcomponents: {
    PrimaryButtonAnchor,
    SecondaryButton,
    SecondaryButtonAnchor,
    DangerButton,
    DangerButtonAnchor,
    SkeletonButton,
    SkeletonButtonAnchor,
    TextButton,
    TextButtonAnchor,
  },
  parameters: {
    docs: {
      description: { component: readme },
    },
  },
}

export const Default: Story = () => (
  <PrimaryButton onClick={action('clicked')}>Button</PrimaryButton>
)

export const ButtonType: Story = () => (
  <Wrapper>
    <PrimaryButton onClick={action('clicked')}>Primary</PrimaryButton>
    <SecondaryButton onClick={action('clicked')}>Secondary</SecondaryButton>
    <DangerButton onClick={action('clicked')}>Danger</DangerButton>
    <SkeletonButton onClick={action('clicked')}>Skeleton</SkeletonButton>
    <TextButton onClick={action('clicked')}>Text</TextButton>
  </Wrapper>
)
ButtonType.parameters = {
  docs: {
    description: {
      story:
        'You can choose  `Primary`, `Secondary`, `Danger`, `Skeleton` or `Text` type according to your use.',
    },
  },
  backgrounds: {
    default: '_grey',
    values: [{ name: '_grey', value: '#ddd' }],
  },
}

export const AnchorButton: Story = () => (
  <PrimaryButtonAnchor href="#" onClick={action('clicked')}>
    Anchor
  </PrimaryButtonAnchor>
)
AnchorButton.parameters = {
  docs: {
    description: {
      story: 'You can use a button as `<a>` tag.',
    },
  },
}

export const Disabled: Story = () => (
  <Wrapper onClick={() => console.log('wapper')}>
    <PrimaryButton disabled onClick={action('clicked')}>
      Button
    </PrimaryButton>
    <PrimaryButtonAnchor disabled href="#" onClick={action('clicked')}>
      Anchor
    </PrimaryButtonAnchor>
  </Wrapper>
)
Disabled.parameters = {
  docs: {
    description: {
      story: 'A button can be disabled.',
    },
  },
}

export const Size: Story = () => (
  <Wrapper>
    <PrimaryButton size="default" onClick={action('clicked')}>
      Default Size
    </PrimaryButton>
    <PrimaryButton size="s" onClick={action('clicked')}>
      Small Size
    </PrimaryButton>
  </Wrapper>
)
Size.parameters = {
  docs: {
    description: {
      story: 'You can choose a button size from `default` or `s`.',
    },
  },
}

export const Square: Story = () => (
  <Wrapper>
    <PrimaryButton square onClick={action('clicked')}>
      M
    </PrimaryButton>
    <PrimaryButton square size="s" onClick={action('clicked')}>
      M
    </PrimaryButton>
  </Wrapper>
)
Square.parameters = {
  docs: {
    description: {
      story: 'A button can be square.',
    },
  },
}

export const WithIcon: Story = () => (
  <Wrapper>
    <PrimaryButton prefix={<FaPlusCircleIcon size={16} />} onClick={action('clicked')}>
      Prefix
    </PrimaryButton>
    <PrimaryButton suffix={<FaPlusCircleIcon size={16} />} onClick={action('clicked')}>
      Suffix
    </PrimaryButton>
    <PrimaryButton square onClick={action('clicked')}>
      <FaPlusCircleIcon size={16} />
    </PrimaryButton>
  </Wrapper>
)
WithIcon.parameters = {
  docs: {
    description: {
      story: 'A button can contain an icon.',
    },
  },
}

export const Wide: Story = () => (
  <PrimaryButton wide onClick={action('clicked')}>
    Wide
  </PrimaryButton>
)
Wide.parameters = {
  docs: {
    description: {
      story: 'A button can be extended to its full width.',
    },
  },
}

export const ExtendingStyle: Story = () => (
  <Extended onClick={action('clicked')}>width: 300px</Extended>
)
ExtendingStyle.parameters = {
  docs: {
    description: {
      story:
        'A button style can be customized by [Extending Styles](https://styled-components.com/docs/basics#extending-styles) of `styled-compontns`.',
    },
  },
}

export const Reg = RegStory

const Wrapper = styled.div`
  > * {
    margin-right: 1rem;
  }
`
const Extended = styled(PrimaryButton)`
  width: 300px;
`
