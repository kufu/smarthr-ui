import { Button } from '../../Button'
import { DialogCloser } from '../DialogCloser'
import { DialogContent } from '../DialogContent'
import { DialogTrigger } from '../DialogTrigger'
import { DialogWrapper } from '../DialogWrapper'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Dialog/DialogWrapper',
  component: DialogWrapper,
  render: (args) => (
    <DialogWrapper {...args}>
      <DialogTrigger>
        <Button>ダイアログを開く</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogCloser>
          <Button>閉じる</Button>
        </DialogCloser>
      </DialogContent>
    </DialogWrapper>
  ),
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof DialogWrapper>

export const Playground: StoryObj<typeof DialogWrapper> = {}
