import { action } from 'storybook/actions'
import { Button } from '../../../Button'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'

import type { Meta, StoryObj } from '@storybook/react'
import { RemoteTriggerFormDialog } from '../RemoteTriggerFormDialog'

/** props は [FormDialog](./?path=/docs/dialog（ダイアログ）-dialog-formdialog--docs) を参照してください。 */
export default {
  title: 'Dialog（ダイアログ）/Dialog/RemoteDialogTrigger/RemoteTriggerFormDialog',
  component: RemoteTriggerFormDialog,
  render: (args) => {
    return (
      <>
        <RemoteDialogTrigger targetId="remote-dialog">
          <Button>ダイアログを開く</Button>
        </RemoteDialogTrigger>
        <RemoteTriggerFormDialog
          {...args}
          id="remote-dialog"
          title="リモートトリガーフォームダイアログ"
          actionText="アクション"
          onSubmit={action('onSubmit')}
        >
          <p>リモートトリガーフォームダイアログです。</p>
        </RemoteTriggerFormDialog>
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RemoteTriggerFormDialog>

export const Playground: StoryObj<typeof RemoteTriggerFormDialog> = {}
