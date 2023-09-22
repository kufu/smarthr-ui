import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import { within } from '@storybook/testing-library'
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

export const _ButtonState: StoryFn = () => (
  <div>
    <dt>Hover</dt>
    <dd style={{ padding: '10px' }}>
      <Stack>
        <Cluster gap={1}>
          <Button id="hover-primary" variant="primary" onClick={action('clicked')}>
            ボタン
          </Button>
          <Button id="hover-secondary" variant="secondary" onClick={action('clicked')}>
            ボタン
          </Button>
          <Button id="hover-danger" variant="danger" onClick={action('clicked')}>
            ボタン
          </Button>
          <Button id="hover-text" variant="text" onClick={action('clicked')}>
            ボタン
          </Button>
        </Cluster>
        <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
          <Cluster>
            <Button id="hover-skeleton" variant="skeleton" onClick={action('clicked')}>
              ボタン
            </Button>
          </Cluster>
        </div>
      </Stack>
    </dd>
    <dt>Focus visible</dt>
    <dd style={{ padding: '10px' }}>
      <Stack>
        <Cluster gap={1}>
          <Button id="focus-primary" variant="primary" onClick={action('clicked')}>
            ボタン
          </Button>
          <Button id="focus-secondary" variant="secondary" onClick={action('clicked')}>
            ボタン
          </Button>
          <Button id="focus-danger" variant="danger" onClick={action('clicked')}>
            ボタン
          </Button>
          <Button id="focus-text" variant="text" onClick={action('clicked')}>
            ボタン
          </Button>
        </Cluster>
        <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
          <Cluster>
            <Button id="focus-skeleton" variant="skeleton" onClick={action('clicked')}>
              ボタン
            </Button>
          </Cluster>
        </div>
      </Stack>
    </dd>
  </div>
)
_ButtonState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: [
      '#hover-primary',
      '#hover-secondary',
      '#hover-danger',
      '#hover-text',
      '#hover-skeleton',
    ],
    focusVisible: [
      '#focus-primary',
      '#focus-secondary',
      '#focus-danger',
      '#focus-text',
      '#focus-skeleton',
    ],
  },
}

// export const _ButtonFocused: StoryFn = () => (
//   <div>
//     <dt>Default</dt>
//     <dd>
//       <Stack>
//         <Cluster>
//           <Button data-testid="button-1" variant="primary" onClick={action('clicked')}>
//             Primaryボタン
//           </Button>
//           <Button data-testid="button-2" variant="danger" onClick={action('clicked')}>
//             Dangerボタン
//           </Button>
//         </Cluster>
//       </Stack>
//     </dd>
//   </div>
// )
// _ButtonFocused.parameters = {
//   controls: { hideNoControlsWarning: true },
// }
// _ButtonFocused.play = async ({ canvasElement }) => {
//   const canvas = within(canvasElement)
//   const primaryButton = canvas.getByTestId('button-1')
//   await primaryButton.focus()
//   const dangerButton = canvas.getByTestId('button-2')
//   await dangerButton.focus()
// }
