import { Story } from '@storybook/react'
import React from 'react'
import { action } from '@storybook/addon-actions'
import styled, { css } from 'styled-components'

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
import { AnchorProps, ButtonProps } from './BaseButton'
import { LineUp, Stack } from '../Layout'

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
}

export const _PrimaryButton: Story = () => {
  return renderButtons(PrimaryButton, ExPrimaryButton)
}

export const _PrimaryButtonAnchor: Story = () => {
  return renderAnchors(PrimaryButtonAnchor, ExPrimaryButtonAnchor)
}

export const _SecondaryButton: Story = () => {
  return renderButtons(SecondaryButton, ExSecondaryButton)
}

export const _SecondaryButtonAnchor: Story = () => {
  return renderAnchors(SecondaryButtonAnchor, ExSecondaryButtonAnchor)
}

export const _DangerButton: Story = () => {
  return renderButtons(DangerButton, ExDangerButton)
}

export const _DangerButtonAnchor: Story = () => {
  return renderAnchors(DangerButtonAnchor, ExDangerButtonAnchor)
}

export const _SkeletonButton: Story = () => {
  return <DarkBackground>{renderButtons(SkeletonButton, ExSkeletonButton)}</DarkBackground>
}

export const _SkeletonButtonAnchor: Story = () => {
  return (
    <DarkBackground>{renderAnchors(SkeletonButtonAnchor, ExSkeletonButtonAnchor)}</DarkBackground>
  )
}

export const _TextButton: Story = () => {
  return renderButtons(TextButton, ExTextButton, true)
}

export const _TextButtonAnchor: Story = () => {
  return renderAnchors(TextButtonAnchor, ExTextButtonAnchor, true)
}

function renderButtons(
  Button: React.VFC<ButtonProps>,
  ExButton: React.VFC<ButtonProps>,
  noSquare = false,
) {
  return (
    <List>
      <dt>Default</dt>
      <dd>
        <Stack>
          <WrapLineUp>
            <Button onClick={action('clicked')}>ボタン</Button>
            <Button prefix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Button>
            <Button suffix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Button>
            {!noSquare && (
              <Button square onClick={action('clicked')}>
                <FaPlusCircleIcon size={16} visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
          <WrapLineUp>
            <Button disabled onClick={action('clicked')}>
              ボタン
            </Button>
            <Button disabled prefix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Button>
            <Button disabled suffix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Button>
            {!noSquare && (
              <Button disabled square onClick={action('clicked')}>
                <FaPlusCircleIcon size={16} visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Small</dt>
      <dd>
        <Stack>
          <WrapLineUp>
            <Button size="s" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button size="s" prefix={<FaPlusCircleIcon size={11} />} onClick={action('clicked')}>
              ボタン
            </Button>
            <Button size="s" suffix={<FaPlusCircleIcon size={11} />} onClick={action('clicked')}>
              ボタン
            </Button>
            {!noSquare && (
              <Button size="s" square onClick={action('clicked')}>
                <FaPlusCircleIcon size={13} visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
          <WrapLineUp>
            <Button disabled size="s" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button
              disabled
              size="s"
              prefix={<FaPlusCircleIcon size={11} />}
              onClick={action('clicked')}
            >
              ボタン
            </Button>
            <Button
              disabled
              size="s"
              suffix={<FaPlusCircleIcon size={11} />}
              onClick={action('clicked')}
            >
              ボタン
            </Button>
            {!noSquare && (
              <Button disabled size="s" square onClick={action('clicked')}>
                <FaPlusCircleIcon size={13} visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Wide</dt>
      <dd>
        <Stack>
          <Button wide onClick={action('clicked')}>
            ボタン
          </Button>
          <Button disabled wide onClick={action('clicked')}>
            ボタン
          </Button>
          <Button size="s" wide onClick={action('clicked')}>
            ボタン
          </Button>
          <Button disabled size="s" wide onClick={action('clicked')}>
            ボタン
          </Button>
        </Stack>
      </dd>

      <dt>Extending Style</dt>
      <dd>
        <ExButton onClick={action('clicked')}>width: 300px</ExButton>
      </dd>
    </List>
  )
}

function renderAnchors(
  Anchor: React.VFC<AnchorProps>,
  ExAnchor: React.VFC<AnchorProps>,
  noSquare = false,
) {
  return (
    <List>
      <dt>Default</dt>
      <dd>
        <Stack>
          <WrapLineUp>
            <Anchor href="#" onClick={action('clicked')}>
              ボタン
            </Anchor>
            <Anchor href="#" prefix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Anchor>
            <Anchor href="#" suffix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Anchor>
            {!noSquare && (
              <Anchor href="#" square onClick={action('clicked')}>
                <FaPlusCircleIcon size={16} visuallyHiddenText="プラスボタン" />
              </Anchor>
            )}
          </WrapLineUp>
          <WrapLineUp>
            <Anchor onClick={action('clicked')}>ボタン</Anchor>
            <Anchor prefix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Anchor>
            <Anchor suffix={<FaPlusCircleIcon size={14} />} onClick={action('clicked')}>
              ボタン
            </Anchor>
            {!noSquare && (
              <Anchor square onClick={action('clicked')}>
                <FaPlusCircleIcon size={16} visuallyHiddenText="プラスボタン" />
              </Anchor>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Small</dt>
      <dd>
        <Stack>
          <WrapLineUp>
            <Anchor size="s" href="#" onClick={action('clicked')}>
              ボタン
            </Anchor>
            <Anchor
              size="s"
              href="#"
              prefix={<FaPlusCircleIcon size={11} />}
              onClick={action('clicked')}
            >
              ボタン
            </Anchor>
            <Anchor
              size="s"
              href="#"
              suffix={<FaPlusCircleIcon size={11} />}
              onClick={action('clicked')}
            >
              ボタン
            </Anchor>
            {!noSquare && (
              <Anchor size="s" href="#" square onClick={action('clicked')}>
                <FaPlusCircleIcon size={13} visuallyHiddenText="プラスボタン" />
              </Anchor>
            )}
          </WrapLineUp>
          <WrapLineUp>
            <Anchor size="s" onClick={action('clicked')}>
              ボタン
            </Anchor>
            <Anchor size="s" prefix={<FaPlusCircleIcon size={11} />} onClick={action('clicked')}>
              ボタン
            </Anchor>
            <Anchor size="s" suffix={<FaPlusCircleIcon size={11} />} onClick={action('clicked')}>
              ボタン
            </Anchor>
            {!noSquare && (
              <Anchor size="s" square onClick={action('clicked')}>
                <FaPlusCircleIcon size={13} visuallyHiddenText="プラスボタン" />
              </Anchor>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Wide</dt>
      <dd>
        <Stack>
          <Anchor href="#" wide onClick={action('clicked')}>
            ボタン
          </Anchor>

          <Anchor wide onClick={action('clicked')}>
            ボタン
          </Anchor>
          <Anchor size="s" href="#" wide onClick={action('clicked')}>
            ボタン
          </Anchor>
          <Anchor size="s" wide onClick={action('clicked')}>
            ボタン
          </Anchor>
        </Stack>
      </dd>

      <dt>Extending Style</dt>
      <dd>
        <ExAnchor href="#" onClick={action('clicked')}>
          width: 300px
        </ExAnchor>
      </dd>
    </List>
  )
}

const List = styled.dl`
  margin: 0;
  padding: 1rem;
  dt {
    margin: 0 0 1rem;
  }
  dd {
    margin: 0 0 1rem;
  }
`
const WrapLineUp = styled(LineUp)`
  flex-wrap: wrap;
`
const DarkBackground = styled.div`
  background-color: #5c5c5c;
  color: #fff;
`

const extendingStlye = css`
  width: 300px;
`
const ExPrimaryButton = styled(PrimaryButton)`
  ${extendingStlye}
`
const ExPrimaryButtonAnchor = styled(PrimaryButtonAnchor)`
  ${extendingStlye}
`
const ExSecondaryButton = styled(SecondaryButton)`
  ${extendingStlye}
`
const ExSecondaryButtonAnchor = styled(SecondaryButtonAnchor)`
  ${extendingStlye}
`
const ExDangerButton = styled(DangerButton)`
  ${extendingStlye}
`
const ExDangerButtonAnchor = styled(DangerButtonAnchor)`
  ${extendingStlye}
`
const ExSkeletonButton = styled(SkeletonButton)`
  ${extendingStlye}
`
const ExSkeletonButtonAnchor = styled(SkeletonButtonAnchor)`
  ${extendingStlye}
`
const ExTextButton = styled(TextButton)`
  ${extendingStlye}
`
const ExTextButtonAnchor = styled(TextButtonAnchor)`
  ${extendingStlye}
`
