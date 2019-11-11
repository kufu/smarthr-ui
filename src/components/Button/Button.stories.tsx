import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { PrimaryButton, PrimaryButtonAnchor } from './PrimaryButton'
import { SecondaryButton, SecondaryButtonAnchor } from './SecondaryButton'
import { DangerButton, DangerButtonAnchor } from './DangerButton'
import { SkeletonButton, SkeletonButtonAnchor } from './SkeletonButton'
import { TextButton } from './TextButton'
import { TextButtonAnchor } from './TextButton'

import { Icon } from '../Icon'
import { Base } from '../Base'

import readme from './README.md'

storiesOf('Button', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('Primary', () => (
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
        <PrimaryButton
          prefix={<Icon size={14} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
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
        <PrimaryButton
          suffix={<Icon size={14} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
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
  .add('Secondary', () => (
    <>
      <Wrapper>
        <p>Default Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <SecondaryButton onClick={action('clicked')}>Button</SecondaryButton>
        <SecondaryButtonAnchor href="#">Anchor</SecondaryButtonAnchor>
        <SecondaryButton disabled={true}>Disabled</SecondaryButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <SecondaryButton
          prefix={<Icon size={14} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SecondaryButton>
        <SecondaryButtonAnchor prefix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </SecondaryButtonAnchor>
        <SecondaryButton prefix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SecondaryButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Right)</p>
        <SecondaryButton
          suffix={<Icon size={14} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SecondaryButton>
        <SecondaryButtonAnchor suffix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </SecondaryButtonAnchor>
        <SecondaryButton suffix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SecondaryButton>
      </Wrapper>

      <Wrapper>
        <p>Only icon</p>
        <SecondaryButton onClick={action('clicked')} square>
          <Icon size={16} name="fa-plus-circle" />
        </SecondaryButton>
        <SecondaryButtonAnchor href="#" square>
          <Icon size={16} name="fa-plus-circle" />
        </SecondaryButtonAnchor>
        <SecondaryButton disabled={true} square>
          <Icon size={16} name="fa-plus-circle" />
        </SecondaryButton>
      </Wrapper>

      <Wrapper className="wide">
        <p>Wide</p>
        <SecondaryButton onClick={action('clicked')} wide={true}>
          Button
        </SecondaryButton>
        <SecondaryButtonAnchor href="#" wide={true}>
          Anchor
        </SecondaryButtonAnchor>
        <SecondaryButton disabled={true} wide={true}>
          Disabled
        </SecondaryButton>
      </Wrapper>

      <Wrapper>
        <p>Small Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <SecondaryButton size="s" onClick={action('clicked')}>
          Button
        </SecondaryButton>
        <SecondaryButtonAnchor size="s" href="#">
          Anchor
        </SecondaryButtonAnchor>
        <SecondaryButton size="s" disabled={true}>
          Disabled
        </SecondaryButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <SecondaryButton
          size="s"
          prefix={<Icon size={11} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SecondaryButton>
        <SecondaryButtonAnchor size="s" prefix={<Icon size={11} name="fa-plus-circle" />} href="#">
          Anchor
        </SecondaryButtonAnchor>
        <SecondaryButton size="s" prefix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SecondaryButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Right)</p>
        <SecondaryButton
          size="s"
          suffix={<Icon size={11} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SecondaryButton>
        <SecondaryButtonAnchor size="s" suffix={<Icon size={11} name="fa-plus-circle" />} href="#">
          Anchor
        </SecondaryButtonAnchor>
        <SecondaryButton size="s" suffix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SecondaryButton>
      </Wrapper>

      <Wrapper>
        <p>Only icon</p>
        <SecondaryButton size="s" onClick={action('clicked')} square>
          <Icon size={13} name="fa-plus-circle" />
        </SecondaryButton>
        <SecondaryButtonAnchor size="s" href="#" square>
          <Icon size={13} name="fa-plus-circle" />
        </SecondaryButtonAnchor>
        <SecondaryButton size="s" disabled={true} square>
          <Icon size={13} name="fa-plus-circle" />
        </SecondaryButton>
      </Wrapper>

      <Wrapper className="wide">
        <p>Wide</p>
        <SecondaryButton size="s" onClick={action('clicked')} wide={true}>
          Button
        </SecondaryButton>
        <SecondaryButtonAnchor size="s" href="#" wide={true}>
          Anchor
        </SecondaryButtonAnchor>
        <SecondaryButton size="s" disabled={true} wide={true}>
          Disabled
        </SecondaryButton>
      </Wrapper>
    </>
  ))
  .add('Danger', () => (
    <>
      <Wrapper>
        <p>Default Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <DangerButton onClick={action('clicked')}>Button</DangerButton>
        <DangerButtonAnchor href="#">Anchor</DangerButtonAnchor>
        <DangerButton disabled={true}>Disabled</DangerButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <DangerButton prefix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
          Button
        </DangerButton>
        <DangerButtonAnchor prefix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </DangerButtonAnchor>
        <DangerButton prefix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </DangerButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Right)</p>
        <DangerButton suffix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
          Button
        </DangerButton>
        <DangerButtonAnchor suffix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </DangerButtonAnchor>
        <DangerButton suffix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </DangerButton>
      </Wrapper>

      <Wrapper>
        <p>Only icon</p>
        <DangerButton onClick={action('clicked')} square>
          <Icon size={16} name="fa-plus-circle" />
        </DangerButton>
        <DangerButtonAnchor href="#" square>
          <Icon size={16} name="fa-plus-circle" />
        </DangerButtonAnchor>
        <DangerButton disabled={true} square>
          <Icon size={16} name="fa-plus-circle" />
        </DangerButton>
      </Wrapper>

      <Wrapper className="wide">
        <p>Wide</p>
        <DangerButton onClick={action('clicked')} wide={true}>
          Button
        </DangerButton>
        <DangerButtonAnchor href="#" wide={true}>
          Anchor
        </DangerButtonAnchor>
        <DangerButton disabled={true} wide={true}>
          Disabled
        </DangerButton>
      </Wrapper>

      <Wrapper>
        <p>Small Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <DangerButton size="s" onClick={action('clicked')}>
          Button
        </DangerButton>
        <DangerButtonAnchor size="s" href="#">
          Anchor
        </DangerButtonAnchor>
        <DangerButton size="s" disabled={true}>
          Disabled
        </DangerButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <DangerButton
          size="s"
          prefix={<Icon size={11} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </DangerButton>
        <DangerButtonAnchor size="s" prefix={<Icon size={11} name="fa-plus-circle" />} href="#">
          Anchor
        </DangerButtonAnchor>
        <DangerButton size="s" prefix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </DangerButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Right)</p>
        <DangerButton
          size="s"
          suffix={<Icon size={11} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </DangerButton>
        <DangerButtonAnchor size="s" suffix={<Icon size={11} name="fa-plus-circle" />} href="#">
          Anchor
        </DangerButtonAnchor>
        <DangerButton size="s" suffix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </DangerButton>
      </Wrapper>

      <Wrapper>
        <p>Only icon</p>
        <DangerButton size="s" onClick={action('clicked')} square>
          <Icon size={13} name="fa-plus-circle" />
        </DangerButton>
        <DangerButtonAnchor size="s" href="#" square>
          <Icon size={13} name="fa-plus-circle" />
        </DangerButtonAnchor>
        <DangerButton size="s" disabled={true} square>
          <Icon size={13} name="fa-plus-circle" />
        </DangerButton>
      </Wrapper>

      <Wrapper className="wide">
        <p>Wide</p>
        <DangerButton size="s" onClick={action('clicked')} wide={true}>
          Button
        </DangerButton>
        <DangerButtonAnchor size="s" href="#" wide={true}>
          Anchor
        </DangerButtonAnchor>
        <DangerButton size="s" disabled={true} wide={true}>
          Disabled
        </DangerButton>
      </Wrapper>
    </>
  ))
  .add('Skeleton', () => (
    <Background>
      <Wrapper>
        <p>Default Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <SkeletonButton onClick={action('clicked')}>Button</SkeletonButton>
        <SkeletonButtonAnchor href="#">Anchor</SkeletonButtonAnchor>
        <SkeletonButton disabled={true}>Disabled</SkeletonButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <SkeletonButton
          prefix={<Icon size={14} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SkeletonButton>
        <SkeletonButtonAnchor prefix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </SkeletonButtonAnchor>
        <SkeletonButton prefix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SkeletonButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Right)</p>
        <SkeletonButton
          suffix={<Icon size={14} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SkeletonButton>
        <SkeletonButtonAnchor suffix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </SkeletonButtonAnchor>
        <SkeletonButton suffix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SkeletonButton>
      </Wrapper>

      <Wrapper>
        <p>Only icon</p>
        <SkeletonButton onClick={action('clicked')} square>
          <Icon size={16} name="fa-plus-circle" />
        </SkeletonButton>
        <SkeletonButtonAnchor href="#" square>
          <Icon size={16} name="fa-plus-circle" />
        </SkeletonButtonAnchor>
        <SkeletonButton disabled={true} square>
          <Icon size={16} name="fa-plus-circle" />
        </SkeletonButton>
      </Wrapper>

      <Wrapper className="wide">
        <p>Wide</p>
        <SkeletonButton onClick={action('clicked')} wide={true}>
          Button
        </SkeletonButton>
        <SkeletonButtonAnchor href="#" wide={true}>
          Anchor
        </SkeletonButtonAnchor>
        <SkeletonButton disabled={true} wide={true}>
          Disabled
        </SkeletonButton>
      </Wrapper>

      <Wrapper>
        <p>Small Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <SkeletonButton size="s" onClick={action('clicked')}>
          Button
        </SkeletonButton>
        <SkeletonButtonAnchor size="s" href="#">
          Anchor
        </SkeletonButtonAnchor>
        <SkeletonButton size="s" disabled={true}>
          Disabled
        </SkeletonButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <SkeletonButton
          size="s"
          prefix={<Icon size={11} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SkeletonButton>
        <SkeletonButtonAnchor size="s" prefix={<Icon size={11} name="fa-plus-circle" />} href="#">
          Anchor
        </SkeletonButtonAnchor>
        <SkeletonButton size="s" prefix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SkeletonButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Right)</p>
        <SkeletonButton
          size="s"
          suffix={<Icon size={11} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </SkeletonButton>
        <SkeletonButtonAnchor size="s" suffix={<Icon size={11} name="fa-plus-circle" />} href="#">
          Anchor
        </SkeletonButtonAnchor>
        <SkeletonButton size="s" suffix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </SkeletonButton>
      </Wrapper>

      <Wrapper>
        <p>Only icon</p>
        <SkeletonButton size="s" onClick={action('clicked')} square>
          <Icon size={13} name="fa-plus-circle" />
        </SkeletonButton>
        <SkeletonButtonAnchor size="s" href="#" square>
          <Icon size={13} name="fa-plus-circle" />
        </SkeletonButtonAnchor>
        <SkeletonButton size="s" disabled={true} square>
          <Icon size={13} name="fa-plus-circle" />
        </SkeletonButton>
      </Wrapper>

      <Wrapper className="wide">
        <p>Wide</p>
        <SkeletonButton size="s" onClick={action('clicked')} wide={true}>
          Button
        </SkeletonButton>
        <SkeletonButtonAnchor size="s" href="#" wide={true}>
          Anchor
        </SkeletonButtonAnchor>
        <SkeletonButton size="s" disabled={true} wide={true}>
          Disabled
        </SkeletonButton>
      </Wrapper>
    </Background>
  ))
  .add('Text', () => (
    <Base>
      <Wrapper>
        <p>Default Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <TextButton onClick={action('clicked')}>Button</TextButton>
        <TextButtonAnchor href="#">Anchor</TextButtonAnchor>
        <TextButton disabled={true}>Disabled</TextButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <TextButton prefix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
          Button
        </TextButton>
        <TextButtonAnchor prefix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </TextButtonAnchor>
        <TextButton prefix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </TextButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Right)</p>
        <TextButton suffix={<Icon size={14} name="fa-plus-circle" />} onClick={action('clicked')}>
          Button
        </TextButton>
        <TextButtonAnchor suffix={<Icon size={14} name="fa-plus-circle" />} href="#">
          Anchor
        </TextButtonAnchor>
        <TextButton suffix={<Icon size={14} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </TextButton>
      </Wrapper>

      <Wrapper>
        <p>Small Size</p>
      </Wrapper>

      <Wrapper>
        <p>Default</p>
        <TextButton size="s" onClick={action('clicked')}>
          Button
        </TextButton>
        <TextButtonAnchor size="s" href="#">
          Anchor
        </TextButtonAnchor>
        <TextButton size="s" disabled={true}>
          Disabled
        </TextButton>
      </Wrapper>

      <Wrapper>
        <p>With icon (Left)</p>
        <TextButton
          size="s"
          prefix={<Icon size={11} name="fa-plus-circle" />}
          onClick={action('clicked')}
        >
          Button
        </TextButton>
        <TextButtonAnchor size="s" prefix={<Icon size={11} name="fa-plus-circle" />} href="#">
          Anchor
        </TextButtonAnchor>
        <TextButton size="s" prefix={<Icon size={11} name="fa-plus-circle" />} disabled={true}>
          Disabled
        </TextButton>
      </Wrapper>

      <Wrapper className="wide">
        <p>Wide</p>
        <TextButton size="s" onClick={action('clicked')} wide={true}>
          Button
        </TextButton>
        <TextButtonAnchor size="s" href="#" wide={true}>
          Anchor
        </TextButtonAnchor>
        <TextButton size="s" disabled={true} wide={true}>
          Disabled
        </TextButton>
      </Wrapper>
    </Base>
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

const Background = styled(Base)`
  background-color: #5c5c5c;

  p {
    color: #fff;
  }
`
