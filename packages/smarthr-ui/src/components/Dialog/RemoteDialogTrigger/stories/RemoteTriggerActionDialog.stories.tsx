import { action } from '@storybook/addon-actions'
import { Button } from '../../../Button'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'
import { RemoteTriggerActionDialog } from '../RemoteTriggerActionDialog'

import type { Meta, StoryObj } from '@storybook/react'

/** props は [ActionDialog](./?path=/docs/dialog（ダイアログ）-dialog-actiondialog--docs) を参照してください。 */
export default {
  title: 'Dialog（ダイアログ）/Dialog/RemoteDialogTrigger/RemoteTriggerActionDialog',
  component: RemoteTriggerActionDialog,
  render: (args) => {
    return (
      <>
        <RemoteDialogTrigger targetId="remote-dialog">
          <Button>ダイアログを開く</Button>
        </RemoteDialogTrigger>
        <RemoteTriggerActionDialog
          {...args}
          id="remote-dialog"
          title="リモートトリガーアクションダイアログ"
          actionText="アクション"
          onClickAction={action('onClickAction')}
        >
          <p>リモートトリガーアクションダイアログです。</p>
        </RemoteTriggerActionDialog>
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RemoteTriggerActionDialog>

export const Playground: StoryObj<typeof RemoteTriggerActionDialog> = {}
