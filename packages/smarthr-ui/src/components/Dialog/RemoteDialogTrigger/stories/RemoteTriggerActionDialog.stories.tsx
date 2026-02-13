import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'
import { RemoteTriggerActionDialog } from '../RemoteTriggerActionDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

/** props は [ActionDialog](./?path=/docs/dialog（ダイアログ）-dialog-actiondialog--docs) を参照してください。 */
export default {
  title: 'Components/Dialog/RemoteDialogTrigger/RemoteTriggerActionDialog',
  component: RemoteTriggerActionDialog,
  render: (args) => (
    <>
      <RemoteDialogTrigger targetId="remote-dialog">
        <Button>ダイアログを開く</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerActionDialog
        {...args}
        id="remote-dialog"
        heading="リモートトリガーアクションダイアログ"
        actionText="アクション"
        onClickAction={action('onClickAction')}
      >
        <p>リモートトリガーアクションダイアログです。</p>
      </RemoteTriggerActionDialog>
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RemoteTriggerActionDialog>

export const Playground: StoryObj<typeof RemoteTriggerActionDialog> = {}
