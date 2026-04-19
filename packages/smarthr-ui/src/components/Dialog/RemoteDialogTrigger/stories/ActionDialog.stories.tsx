import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { ActionDialog } from '../ActionDialog'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

/** props は [ActionDialog](./?path=/docs/dialog（ダイアログ）-dialog-actiondialog--docs) を参照してください。 */
export default {
  title: 'Components/Dialog/RemoteDialogTrigger/ActionDialog',
  component: ActionDialog,
  render: (args) => (
    <>
      <RemoteDialogTrigger targetId="remote-dialog">
        <Button>ダイアログを開く</Button>
      </RemoteDialogTrigger>
      <ActionDialog
        {...args}
        id="remote-dialog"
        heading="アクションダイアログ"
        actionText="アクション"
        onClickAction={(e, { close }) => {
          action('onClickAction')(e)
          close()
        }}
      >
        <p>アクションダイアログです。</p>
      </ActionDialog>
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof ActionDialog>

export const Playground: StoryObj<typeof ActionDialog> = {}
