import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'
import { RemoteTriggerFormDialog } from '../RemoteTriggerFormDialog'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

/** props は [FormDialog](./?path=/docs/dialog（ダイアログ）-dialog-formdialog--docs) を参照してください。 */
export default {
  title: 'Components/Dialog/RemoteDialogTrigger/RemoteTriggerFormDialog',
  component: RemoteTriggerFormDialog,
  render: (args) => (
    <>
      <RemoteDialogTrigger targetId="remote-dialog">
        <Button>ダイアログを開く</Button>
      </RemoteDialogTrigger>
      <RemoteTriggerFormDialog
        {...args}
        id="remote-dialog"
        heading="リモートトリガーフォームダイアログ"
        actionText="アクション"
        onSubmit={action('onSubmit')}
      >
        <p>リモートトリガーフォームダイアログです。</p>
      </RemoteTriggerFormDialog>
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RemoteTriggerFormDialog>

export const Playground: StoryObj<typeof RemoteTriggerFormDialog> = {}
