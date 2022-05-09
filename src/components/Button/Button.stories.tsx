import { Story } from '@storybook/react'
import React from 'react'
import { action } from '@storybook/addon-actions'
import styled, { css } from 'styled-components'

import { AnchorButton, Button } from '.'
import { FaPlusCircleIcon, FaPlusIcon, FaPlusSquareIcon } from '../Icon'
import { LineUp, Stack } from '../Layout'

export default {
  title: 'Button',
  component: Button,
  subcomponents: {
    AnchorButton,
  },
}

type ButtonProps = React.ComponentProps<typeof Button>
type AnchorButtonProps = React.ComponentProps<typeof AnchorButton>

export const _PrimaryButton: Story = () => {
  return renderButtons('primary')
}

export const _PrimaryButtonAnchor: Story = () => {
  return renderAnchors('primary')
}

export const _SecondaryButton: Story = () => {
  return renderButtons('secondary')
}

export const _SecondaryButtonAnchor: Story = () => {
  return renderAnchors('secondary')
}

export const _DangerButton: Story = () => {
  return renderButtons('danger')
}

export const _DangerButtonAnchor: Story = () => {
  return renderAnchors('danger')
}

export const _SkeletonButton: Story = () => {
  return <DarkBackground>{renderButtons('skeleton')}</DarkBackground>
}

export const _SkeletonButtonAnchor: Story = () => {
  return <DarkBackground>{renderAnchors('skeleton')}</DarkBackground>
}

export const _TextButton: Story = () => {
  return renderButtons('text', true)
}

export const _TextButtonAnchor: Story = () => {
  return renderAnchors('text', true)
}

function renderButtons(variant: ButtonProps['variant'], noSquare = false) {
  return (
    <List>
      <dt>Default</dt>
      <dd>
        <Stack>
          <WrapLineUp vAlign="center">
            <Button variant={variant} onClick={action('clicked')}>
              ボタン
            </Button>
            <Button variant={variant} prefix={<FaPlusIcon />} onClick={action('clicked')}>
              ボタン
            </Button>
            <Button variant={variant} suffix={<FaPlusSquareIcon />} onClick={action('clicked')}>
              ボタン
            </Button>
            {!noSquare && (
              <Button variant={variant} square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
          <WrapLineUp vAlign="center">
            <Button variant={variant} disabled onClick={action('clicked')}>
              ボタン
            </Button>
            <Button variant={variant} disabled prefix={<FaPlusIcon />} onClick={action('clicked')}>
              ボタン
            </Button>
            <Button
              variant={variant}
              disabled
              suffix={<FaPlusSquareIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </Button>
            {!noSquare && (
              <Button variant={variant} disabled square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Small</dt>
      <dd>
        <Stack>
          <WrapLineUp vAlign="center">
            <Button variant={variant} size="s" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button variant={variant} size="s" prefix={<FaPlusIcon />} onClick={action('clicked')}>
              ボタン
            </Button>
            <Button
              variant={variant}
              size="s"
              suffix={<FaPlusSquareIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </Button>
            {!noSquare && (
              <Button variant={variant} size="s" square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
          <WrapLineUp vAlign="center">
            <Button variant={variant} disabled size="s" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button
              variant={variant}
              disabled
              size="s"
              prefix={<FaPlusIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </Button>
            <Button
              variant={variant}
              disabled
              size="s"
              suffix={<FaPlusSquareIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </Button>
            {!noSquare && (
              <Button variant={variant} disabled size="s" square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </Button>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Wide</dt>
      <dd>
        <Stack>
          <Button variant={variant} wide onClick={action('clicked')}>
            ボタン
          </Button>
          <Button variant={variant} disabled wide onClick={action('clicked')}>
            ボタン
          </Button>
          <Button variant={variant} size="s" wide onClick={action('clicked')}>
            ボタン
          </Button>
          <Button variant={variant} disabled size="s" wide onClick={action('clicked')}>
            ボタン
          </Button>
        </Stack>
      </dd>

      <dt>Extending Style</dt>
      <dd>
        <ExtendingButton variant={variant} onClick={action('clicked')}>
          width: 300px
        </ExtendingButton>
      </dd>
    </List>
  )
}

function renderAnchors(variant: AnchorButtonProps['variant'], noSquare = false) {
  return (
    <List>
      <dt>Default</dt>
      <dd>
        <Stack>
          <WrapLineUp vAlign="center">
            <AnchorButton variant={variant} href="#" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton
              variant={variant}
              href="#"
              prefix={<FaPlusIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton
              variant={variant}
              href="#"
              suffix={<FaPlusSquareIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            {!noSquare && (
              <AnchorButton variant={variant} href="#" square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </AnchorButton>
            )}
          </WrapLineUp>
          <WrapLineUp vAlign="center">
            <AnchorButton variant={variant} onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton variant={variant} prefix={<FaPlusIcon />} onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton
              variant={variant}
              suffix={<FaPlusSquareIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            {!noSquare && (
              <AnchorButton variant={variant} square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </AnchorButton>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Small</dt>
      <dd>
        <Stack>
          <WrapLineUp vAlign="center">
            <AnchorButton variant={variant} size="s" href="#" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton
              variant={variant}
              size="s"
              href="#"
              prefix={<FaPlusIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton
              variant={variant}
              size="s"
              href="#"
              suffix={<FaPlusSquareIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            {!noSquare && (
              <AnchorButton variant={variant} size="s" href="#" square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </AnchorButton>
            )}
          </WrapLineUp>
          <WrapLineUp vAlign="center">
            <AnchorButton variant={variant} size="s" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton
              variant={variant}
              size="s"
              prefix={<FaPlusIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton
              variant={variant}
              size="s"
              suffix={<FaPlusSquareIcon />}
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            {!noSquare && (
              <AnchorButton variant={variant} size="s" square onClick={action('clicked')}>
                <FaPlusCircleIcon visuallyHiddenText="プラスボタン" />
              </AnchorButton>
            )}
          </WrapLineUp>
        </Stack>
      </dd>

      <dt>Wide</dt>
      <dd>
        <Stack>
          <AnchorButton variant={variant} href="#" wide onClick={action('clicked')}>
            ボタン
          </AnchorButton>

          <AnchorButton variant={variant} wide onClick={action('clicked')}>
            ボタン
          </AnchorButton>
          <AnchorButton variant={variant} size="s" href="#" wide onClick={action('clicked')}>
            ボタン
          </AnchorButton>
          <AnchorButton variant={variant} size="s" wide onClick={action('clicked')}>
            ボタン
          </AnchorButton>
        </Stack>
      </dd>

      <dt>Extending Style</dt>
      <dd>
        <ExtendingAnchorButton variant={variant} href="#" onClick={action('clicked')}>
          width: 300px
        </ExtendingAnchorButton>
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

const extendingStyle = css`
  width: 300px;
`
const ExtendingButton = styled(Button)`
  ${extendingStyle}
`
const ExtendingAnchorButton = styled(AnchorButton)`
  ${extendingStyle}
`
