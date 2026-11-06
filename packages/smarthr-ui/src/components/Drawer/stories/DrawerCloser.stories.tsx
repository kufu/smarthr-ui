import { useId } from 'react'

import { Button } from '../../Button'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { RemoteDrawerTrigger } from '../RemoteDrawerTrigger'
import { Drawer, DrawerCloser, DrawerHeader } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Drawer/DrawerCloser',
  component: DrawerCloser,
  render: (args) => {
    // Docs では全ストーリーが1ページに並ぶため、id を固定すると1つのトリガーで全部開いてしまう
    const id = useId()

    return (
      <>
        <RemoteDrawerTrigger targetId={id}>
          <Button>ドロワーを開く</Button>
        </RemoteDrawerTrigger>
        <Drawer id={id} size="S">
          <DrawerHeader title="ドロワータイトル" />
          <DrawerBody>
            <p>
              <code>DrawerCloser</code> で包んだボタンは、<code>DrawerHeader</code>{' '}
              の閉じるボタンと同じくドロワーを閉じます。
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerCloser {...args}>
              <Button>閉じる</Button>
            </DrawerCloser>
          </DrawerFooter>
        </Drawer>
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof DrawerCloser>

export const Playground: StoryObj<typeof DrawerCloser> = {}
