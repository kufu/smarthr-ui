import { Story } from '@storybook/react'
import React from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'

import { AnchorButton, Button } from '.'

export default {
  title: 'Button',
  component: Button,
  subcomponents: {
    AnchorButton,
  },
  argTypes: {
    children: { control: 'text' },
    prefix: { control: 'text' },
    suffix: { control: 'text' },
  },
}

type ButtonProps = React.ComponentProps<typeof Button>
type AnchorButtonProps = React.ComponentProps<typeof AnchorButton>

export const _Button: Story = (args: ButtonProps) => {
  return (
    <Wrapper>
      <Button onClick={action('clicked')} {...args}>
        ボタン
      </Button>
    </Wrapper>
  )
}

export const _ButtonAnchor: Story = (args: AnchorButtonProps) => {
  return (
    <Wrapper>
      <AnchorButton href="#" onClick={action('clicked')} {...args}>
        ボタン
      </AnchorButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  padding: 24px;

  > * + * {
    margin-top: 24px;
  }
`
