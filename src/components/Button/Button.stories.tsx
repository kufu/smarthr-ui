import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'
import { PrimaryButton, PrimaryButtonAnchor } from './PrimaryButton'
import { Icon } from '../Icon'

storiesOf('Button', module).add('all', () => (
  <>
    <Wrapper>
      <p>Default Size</p>
    </Wrapper>

    <Wrapper>
      <p>Default</p>
      <PrimaryButton onClick={action('clicked')}>Button</PrimaryButton>
      <PrimaryButtonAnchor href="#">Anchor</PrimaryButtonAnchor>
      <PrimaryButton disabled={true}>Disabled</PrimaryButton>
    </Wrapper>

    <Wrapper>
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
    </Wrapper>

    <Wrapper>
      <p>With icon (Right)</p>
      <PrimaryButton suffix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
        Button
      </PrimaryButton>
      <PrimaryButtonAnchor suffix={<Icon size={14} name="fa-plus-circle" />} href="#">
        Anchor
      </PrimaryButtonAnchor>
      <PrimaryButton suffix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
        Disabled
      </PrimaryButton>
    </Wrapper>

    <Wrapper>
      <p>Only icon</p>
      <PrimaryButton onClick={action('clicked')} square>
        <Icon size={16} name="fa-plus-circle" />
      </PrimaryButton>
      <PrimaryButtonAnchor href="#" square>
        <Icon size={16} name="fa-plus-circle" />
      </PrimaryButtonAnchor>
      <PrimaryButton disabled={true} square>
        <Icon size={16} name="fa-plus-circle" />
      </PrimaryButton>
    </Wrapper>

    <Wrapper className="wide">
      <p>Wide</p>
      <PrimaryButton onClick={action('clicked')} wide={true}>
        Button
      </PrimaryButton>
      <PrimaryButtonAnchor href="#" wide={true}>
        Anchor
      </PrimaryButtonAnchor>
      <PrimaryButton disabled={true} wide={true}>
        Disabled
      </PrimaryButton>
    </Wrapper>

    <Wrapper>
      <p>Small Size</p>
    </Wrapper>

    <Wrapper>
      <p>Default</p>
      <PrimaryButton size="s" onClick={action('clicked')}>
        Button
      </PrimaryButton>
      <PrimaryButtonAnchor size="s" href="#">
        Anchor
      </PrimaryButtonAnchor>
      <PrimaryButton size="s" disabled={true}>
        Disabled
      </PrimaryButton>
    </Wrapper>

    <Wrapper>
      <p>With icon (Left)</p>
      <PrimaryButton
        size="s"
        prefix={<Icon size={11} name="fa-plus-circle" />}
        onClick={action('clicked')}
      >
        Button
      </PrimaryButton>
      <PrimaryButtonAnchor size="s" prefix={<Icon size={11} name="fa-plus-circle" />} href="#">
        Anchor
      </PrimaryButtonAnchor>
      <PrimaryButton size="s" prefix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
        Disabled
      </PrimaryButton>
    </Wrapper>

    <Wrapper>
      <p>With icon (Right)</p>
      <PrimaryButton
        size="s"
        suffix={<Icon size={11} name="fa-plus-circle" />}
        onClick={action('clicked')}
      >
        Button
      </PrimaryButton>
      <PrimaryButtonAnchor size="s" suffix={<Icon size={11} name="fa-plus-circle" />} href="#">
        Anchor
      </PrimaryButtonAnchor>
      <PrimaryButton size="s" suffix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
        Disabled
      </PrimaryButton>
    </Wrapper>

    <Wrapper>
      <p>Only icon</p>
      <PrimaryButton size="s" onClick={action('clicked')} square>
        <Icon size={13} name="fa-plus-circle" />
      </PrimaryButton>
      <PrimaryButtonAnchor size="s" href="#" square>
        <Icon size={13} name="fa-plus-circle" />
      </PrimaryButtonAnchor>
      <PrimaryButton size="s" disabled={true} square>
        <Icon size={13} name="fa-plus-circle" />
      </PrimaryButton>
    </Wrapper>

    <Wrapper className="wide">
      <p>Wide</p>
      <PrimaryButton size="s" onClick={action('clicked')} wide={true}>
        Button
      </PrimaryButton>
      <PrimaryButtonAnchor size="s" href="#" wide={true}>
        Anchor
      </PrimaryButtonAnchor>
      <PrimaryButton size="s" disabled={true} wide={true}>
        Disabled
      </PrimaryButton>
    </Wrapper>
  </>
))

const Wrapper = styled.div`
  margin: 1rem;

  > * {
    margin-right: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }

  &.wide {
    > * {
      margin-bottom: 0.5rem;
    }
  }
`
