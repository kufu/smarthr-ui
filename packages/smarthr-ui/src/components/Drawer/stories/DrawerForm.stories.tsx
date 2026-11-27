import { useId, useState } from 'react'
import { action } from 'storybook/actions'

import { Button } from '../../Button'
import { FormControl } from '../../FormGroup'
import { Input } from '../../Input'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { RemoteDrawerTrigger } from '../RemoteDrawerTrigger'
import { Drawer, DrawerCloser, DrawerForm, DrawerHeader } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Drawer/DrawerForm',
  component: DrawerForm,
  render: (args) => {
    // Docs では全ストーリーが1ページに並ぶため、id を固定すると1つのトリガーで全部開いてしまう
    const id = useId()

    return (
      <>
        <RemoteDrawerTrigger targetId={id}>
          <Button>絞り込み</Button>
        </RemoteDrawerTrigger>
        <Drawer id={id} size="S">
          <DrawerHeader title="絞り込み" />
          <DrawerForm {...args}>
            <DrawerBody>
              <FormControl label="キーワード">
                <Input name="keyword" />
              </FormControl>
            </DrawerBody>
            <DrawerFooter>
              <Button type="reset">リセット</Button>
              <DrawerCloser>
                <Button>キャンセル</Button>
              </DrawerCloser>
              <Button type="submit" variant="primary">
                適用
              </Button>
            </DrawerFooter>
          </DrawerForm>
        </Drawer>
      </>
    )
  },
  args: {
    onSubmit: (e, { close }) => {
      action('onSubmit')(e)
      close()
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DrawerForm>

export const Playground: StoryObj<typeof DrawerForm> = {}

export const OnSubmit: StoryObj<typeof DrawerForm> = {
  name: 'onSubmit',
  render: () => {
    const id = useId()
    const [error, setError] = useState('')

    return (
      <>
        <RemoteDrawerTrigger targetId={id}>
          <Button>編集する</Button>
        </RemoteDrawerTrigger>
        <Drawer id={id} size="S" onClose={() => setError('')}>
          <DrawerHeader title="氏名の編集" />
          <DrawerForm
            onSubmit={(e, { close }) => {
              const name = String(new FormData(e.currentTarget).get('name') ?? '')

              setTimeout(() => {
                if (name) {
                  close()
                } else {
                  setError('氏名を入力してください')
                }
              }, 500)
            }}
          >
            <DrawerBody>
              <FormControl errorMessages={error || undefined} label="氏名">
                <Input name="name" />
              </FormControl>
            </DrawerBody>
            <DrawerFooter>
              <DrawerCloser>
                <Button>キャンセル</Button>
              </DrawerCloser>
              <Button type="submit" variant="primary">
                保存
              </Button>
            </DrawerFooter>
          </DrawerForm>
        </Drawer>
      </>
    )
  },
}
