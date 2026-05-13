import { Button } from '../../../Button'
import { MessageDialog } from '../MessageDialog'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Dialog/RemoteDialogTrigger',
  component: RemoteDialogTrigger,
  args: {
    targetId: 'remote-dialog',
  },
  render: (args) => (
    <>
      <RemoteDialogTrigger {...args}>
        <Button>ダイアログを開く</Button>
      </RemoteDialogTrigger>
      <MessageDialog id="remote-dialog" heading="メッセージダイアログ">
        メッセージダイアログです。
      </MessageDialog>
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RemoteDialogTrigger>

export const Playground: StoryObj<typeof RemoteDialogTrigger> = {}
