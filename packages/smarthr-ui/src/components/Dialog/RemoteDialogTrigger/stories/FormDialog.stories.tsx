import { action } from 'storybook/actions'

import { Button } from '../../../Button'
import { FormDialog } from '../FormDialog'
import { RemoteDialogTrigger } from '../RemoteDialogTrigger'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

/** props は [FormDialog](./?path=/docs/dialog（ダイアログ）-dialog-formdialog--docs) を参照してください。 */
export default {
  title: 'Components/Dialog/RemoteDialogTrigger/FormDialog',
  component: FormDialog,
  render: (args) => (
    <>
      <RemoteDialogTrigger targetId="remote-dialog">
        <Button>ダイアログを開く</Button>
      </RemoteDialogTrigger>
      <FormDialog
        {...args}
        id="remote-dialog"
        heading="フォームダイアログ"
        actionText="アクション"
        onSubmit={(e, { close }) => {
          action('onSubmit')(e)
          close()
        }}
      >
        <p>リモートトリガーフォームダイアログです。</p>
      </FormDialog>
    </>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof FormDialog>

export const Playground: StoryObj<typeof FormDialog> = {}
