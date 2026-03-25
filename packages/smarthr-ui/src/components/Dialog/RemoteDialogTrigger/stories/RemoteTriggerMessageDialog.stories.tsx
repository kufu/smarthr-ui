import { Button } from '../../../Button'
import { MessageDialog } from '../MessageDialog'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

/** props は [MessageDialog](./?path=/docs/dialog（ダイアログ）-dialog-messagedialog--docs) を参照してください。 */
export default {
  title: 'Components/Dialog/RemoteDialogTrigger/MessageDialog',
  component: MessageDialog,
  render: (args) => (
    <>
      <RemoteDialogTrigger targetId="remote-dialog">
        <Button>ダイアログを開く</Button>
      </RemoteDialogTrigger>
      <MessageDialog
        {...args}
        id="remote-dialog"
        heading="リモートトリガーメッセージダイアログ"
        description="RemoteDialogTrigger で開かれた MessageDialog です。"
      />
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof MessageDialog>

export const Playground: StoryObj<typeof MessageDialog> = {}
