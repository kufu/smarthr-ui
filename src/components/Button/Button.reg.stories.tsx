import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React from 'react'

import { Cluster, Stack } from '../Layout'

import { AnchorButton, Button } from '.'

export default {
  title: 'Buttons（ボタン）/Button',
  component: Button,
  subcomponents: {
    AnchorButton,
  },
}

export const _ButtonHover: StoryFn = () => (
  <div>
    <dt>Default</dt>
    <dd>
      <Stack>
        <Cluster>
          <Button variant="primary" onClick={action('clicked')}>
            ボタン
          </Button>
        </Cluster>
      </Stack>
    </dd>
  </div>
)

_ButtonHover.parameters = {
  controls: { hideNoControlsWarning: true },
}

_ButtonHover.play = async ({ canvasElement }) => {
  const button = canvasElement.querySelector('.smarthr-ui-Button')
  await userEvent.hover(button!)
}

export const _ButtonFocused: StoryFn = () => (
  <div>
    <dt>Default</dt>
    <dd>
      <Stack>
        <Cluster>
          <Button variant="primary" onClick={action('clicked')}>
            ボタン
          </Button>
        </Cluster>
      </Stack>
    </dd>
  </div>
)

_ButtonFocused.parameters = {
  controls: { hideNoControlsWarning: true },
}

_ButtonFocused.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const button = canvas.getByRole('button')
  await button.focus()
}
