import { Button } from '../../../Button'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'
import { RemoteTriggerMessageDialog } from '../RemoteTriggerMessageDialog'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Dialog（ダイアログ）/Dialog/RemoteDialogTrigger',
  component: RemoteDialogTrigger,
  args: {
    targetId: 'remote-dialog',
  },
  render: (args) => {
    return (
      <>
        <RemoteDialogTrigger {...args}>
          <Button>ダイアログを開く</Button>
        </RemoteDialogTrigger>
        <RemoteTriggerMessageDialog
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
} as Meta<typeof RemoteDialogTrigger>

export const Playground: StoryObj<typeof RemoteDialogTrigger> = {}
