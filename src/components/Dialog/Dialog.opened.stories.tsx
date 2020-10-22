import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import * as React from 'react'
import styled from 'styled-components'

import { ActionDialog, MessageDialog } from '.'
import readme from './README.md'

storiesOf('Dialog', module)
  .addParameters({
    readme: {
      sidebar: readme,
    },
  })
  .add('MessageDialog', () => (
    <MessageDialog
      isOpen={true}
      title="MessageDialog"
      description={
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
          <br />
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
          <br />
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
          <br />
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
      }
      closeText="close"
      onClickClose={action('clicked close')}
    />
  ))
  .add('ActionDialog', () => (
    <ActionDialog
      isOpen={true}
      title="ActionDialog"
      closeText="close"
      actionText="execute"
      actionTheme="primary"
      onClickAction={action('clicked action')}
      onClickClose={action('clicked close')}
    >
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
        <br />
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
        <br />
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur.
        <br />
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
        anim id est laborum.
      </Text>
    </ActionDialog>
  ))

const Text = styled.p`
  padding: 16px 24px;
  font-size: 14px;
  line-height: 1.5;
`
