import { Button } from '../../Button'
import { DialogCloser } from '../DialogCloser'
import { DialogContent } from '../DialogContent'
import { DialogTrigger } from '../DialogTrigger'
import { DialogWrapper } from '../DialogWrapper'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Dialog（ダイアログ）/Dialog/DialogCloser',
  component: DialogCloser,
  render: (args) => (
    <DialogWrapper>
      <DialogTrigger>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogCloser {...args}>
          <Button>閉じる</Button>
        </DialogCloser>
      </DialogContent>
    </DialogWrapper>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DialogCloser>

export const Playground: StoryObj<typeof DialogCloser> = {}
