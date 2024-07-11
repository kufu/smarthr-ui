import { action } from '@storybook/addon-actions'
import { StoryFn } from '@storybook/react'
import React from 'react'
import styled from 'styled-components'

import { InformationPanel } from '../InformationPanel'
import { Cluster, Stack } from '../Layout'

import { _Button, _ButtonAnchor } from './Button.stories'

import { AnchorButton, Button, UnstyledButton } from '.'

export default {
  title: 'Buttons（ボタン）/Button',
  component: Button,
  subcomponents: {
    AnchorButton,
  },
}

export const _VRTButtonState: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <dl className="*:shr-ms-0">
      <dt>hover</dt>
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
            <UnstyledButton id="hover-unstyled" onClick={action('clicked')}>
              ボタン
            </UnstyledButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <Button id="hover-skeleton" variant="skeleton" onClick={action('clicked')}>
              ボタン
            </Button>
          </div>
        </Stack>
      </dd>

      <dt>focus</dt>
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
            <UnstyledButton id="focus-unstyled" onClick={action('clicked')}>
              ボタン
            </UnstyledButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <Button id="focus-skeleton" variant="skeleton" onClick={action('clicked')}>
              ボタン
            </Button>
          </div>
        </Stack>
      </dd>

      <dt>focus-visible</dt>
      <dd style={{ padding: '10px' }}>
        <Stack>
          <Cluster gap={1}>
            <Button id="focus-visible-primary" variant="primary" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button id="focus-visible-secondary" variant="secondary" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button id="focus-visible-danger" variant="danger" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button id="focus-visible-text" variant="text" onClick={action('clicked')}>
              ボタン
            </Button>
            <UnstyledButton id="focus-visible-unstyled" onClick={action('clicked')}>
              ボタン
            </UnstyledButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <Button id="focus-visible-skeleton" variant="skeleton" onClick={action('clicked')}>
              ボタン
            </Button>
          </div>
        </Stack>
      </dd>

      <dt>active</dt>
      <dd style={{ padding: '10px' }}>
        <Stack>
          <Cluster gap={1}>
            <Button id="active-primary" variant="primary" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button id="active-secondary" variant="secondary" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button id="active-danger" variant="danger" onClick={action('clicked')}>
              ボタン
            </Button>
            <Button id="active-text" variant="text" onClick={action('clicked')}>
              ボタン
            </Button>
            <UnstyledButton id="active-unstyled" onClick={action('clicked')}>
              ボタン
            </UnstyledButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <Button id="active-skeleton" variant="skeleton" onClick={action('clicked')}>
              ボタン
            </Button>
          </div>
        </Stack>
      </dd>
    </dl>
  </>
)

_VRTButtonState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: [
      '#hover-primary',
      '#hover-secondary',
      '#hover-danger',
      '#hover-text',
      '#hover-skeleton',
      '#hover-unstyled',
    ],
    focus: [
      '#focus-primary',
      '#focus-secondary',
      '#focus-danger',
      '#focus-text',
      '#focus-skeleton',
      '#focus-unstyled',
    ],
    focusVisible: [
      '#focus-visible-primary',
      '#focus-visible-secondary',
      '#focus-visible-danger',
      '#focus-visible-text',
      '#focus-visible-skeleton',
      '#focus-visible-unstyled',
    ],
    active: [
      '#active-primary',
      '#active-secondary',
      '#active-danger',
      '#active-text',
      '#active-skeleton',
      '#active-unstyled',
    ],
  },
}

export const _VRTButtonAnchorState: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      hover, activeなどの状態で表示されます
    </VRTInformationPanel>
    <dl className="*:shr-ms-0">
      <dt>hover</dt>
      <dd style={{ padding: '10px' }}>
        <Stack>
          <Cluster gap={1}>
            <AnchorButton href="#" id="hover-primary" variant="primary" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton
              href="#"
              id="hover-secondary"
              variant="secondary"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton href="#" id="hover-danger" variant="danger" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton href="#" id="hover-text" variant="text" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <AnchorButton
              href="#"
              id="hover-skeleton"
              variant="skeleton"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
          </div>
        </Stack>
      </dd>

      <dt>focus</dt>
      <dd style={{ padding: '10px' }}>
        <Stack>
          <Cluster gap={1}>
            <AnchorButton href="#" id="focus-primary" variant="primary" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton
              href="#"
              id="focus-secondary"
              variant="secondary"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton href="#" id="focus-danger" variant="danger" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton href="#" id="focus-text" variant="text" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <AnchorButton
              href="#"
              id="focus-skeleton"
              variant="skeleton"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
          </div>
        </Stack>
      </dd>

      <dt>focus-visible</dt>
      <dd style={{ padding: '10px' }}>
        <Stack>
          <Cluster gap={1}>
            <AnchorButton
              href="#"
              id="focus-visible-primary"
              variant="primary"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton
              href="#"
              id="focus-visible-secondary"
              variant="secondary"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton
              href="#"
              id="focus-visible-danger"
              variant="danger"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton
              href="#"
              id="focus-visible-text"
              variant="text"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <AnchorButton
              href="#"
              id="focus-visible-skeleton"
              variant="skeleton"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
          </div>
        </Stack>
      </dd>

      <dt>active</dt>
      <dd style={{ padding: '10px' }}>
        <Stack>
          <Cluster gap={1}>
            <AnchorButton
              href="#"
              id="active-primary"
              variant="primary"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton
              href="#"
              id="active-secondary"
              variant="secondary"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
            <AnchorButton href="#" id="active-danger" variant="danger" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
            <AnchorButton href="#" id="active-text" variant="text" onClick={action('clicked')}>
              ボタン
            </AnchorButton>
          </Cluster>
          <div style={{ padding: '1rem', backgroundColor: '#5c5c5c', color: '#fff' }}>
            <AnchorButton
              href="#"
              id="active-skeleton"
              variant="skeleton"
              onClick={action('clicked')}
            >
              ボタン
            </AnchorButton>
          </div>
        </Stack>
      </dd>
    </dl>
  </>
)

_VRTButtonAnchorState.parameters = {
  controls: { hideNoControlsWarning: true },
  pseudo: {
    hover: [
      '#hover-primary',
      '#hover-secondary',
      '#hover-danger',
      '#hover-text',
      '#hover-skeleton',
    ],
    focus: [
      '#focus-primary',
      '#focus-secondary',
      '#focus-danger',
      '#focus-text',
      '#focus-skeleton',
    ],
    focusVisible: [
      '#focus-visible-primary',
      '#focus-visible-secondary',
      '#focus-visible-danger',
      '#focus-visible-text',
      '#focus-visible-skeleton',
    ],
    active: [
      '#active-primary',
      '#active-secondary',
      '#active-danger',
      '#active-text',
      '#active-skeleton',
    ],
  },
}

const ButtonTemplate = _Button.bind({})
export const _VRTButtonForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <ButtonTemplate />
  </>
)
_VRTButtonForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const ButtonAnchorTemplate = _ButtonAnchor.bind({})
export const _VRTButtonAnchorForcedColors: StoryFn = () => (
  <>
    <VRTInformationPanel title="VRT 用の Story です">
      Chromatic 上では強制カラーモードで表示されます
    </VRTInformationPanel>
    <ButtonAnchorTemplate />
  </>
)
_VRTButtonAnchorForcedColors.parameters = {
  chromatic: { forcedColors: 'active' },
}

const VRTInformationPanel = styled(InformationPanel)`
  margin-bottom: 24px;
`
