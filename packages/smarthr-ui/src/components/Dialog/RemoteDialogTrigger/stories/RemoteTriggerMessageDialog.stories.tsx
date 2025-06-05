import { Button } from '../../../Button'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'
import { RemoteTriggerMessageDialog } from '../RemoteTriggerMessageDialog'

import type { Meta, StoryObj } from '@storybook/react'

/** props は [MessageDialog](./?path=/docs/dialog（ダイアログ）-dialog-messagedialog--docs) を参照してください。 */
export default {
  title: 'Components/Dialog/RemoteDialogTrigger/RemoteTriggerMessageDialog',
  component: RemoteTriggerMessageDialog,
  render: (args) => {
    return (
      <>
        <RemoteDialogTrigger targetId="remote-dialog">
          <Button>ダイアログを開く</Button>
        </RemoteDialogTrigger>
        <RemoteTriggerMessageDialog
          {...args}
          id="remote-dialog"
          title="リモートトリガーメッセージダイアログ"
          description="RemoteDialogTrigger で開かれた MessageDialog です。"
        />
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RemoteTriggerMessageDialog>

export const Playground: StoryObj<typeof RemoteTriggerMessageDialog> = {}
