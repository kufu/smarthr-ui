import { useId } from 'react'

import { Button } from '../../Button'
import { Table, Td, Th } from '../../Table'
import { DrawerBody } from '../DrawerBody'
import { RemoteDrawerTrigger } from '../RemoteDrawerTrigger'
import { Drawer, DrawerHeader } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Drawer/RemoteDrawerTrigger',
  component: RemoteDrawerTrigger,
  render: (args) => {
    // Docs では全ストーリーが1ページに並ぶため、id を固定すると1つのトリガーで全部開いてしまう
    const id = useId()

    return (
      <>
        <RemoteDrawerTrigger {...args} targetId={id}>
          <Button>ドロワーを開く</Button>
        </RemoteDrawerTrigger>
        <Drawer id={id} size="S">
          <DrawerHeader title="リモートトリガードロワー" />
          <DrawerBody>
            <p>RemoteDrawerTrigger で開かれた Drawer です。</p>
          </DrawerBody>
        </Drawer>
      </>
    )
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof RemoteDrawerTrigger>

export const Playground: StoryObj<typeof RemoteDrawerTrigger> = {}

const employees = [
  { id: '00001', name: '山田 太郎', department: '開発部' },
  { id: '00002', name: '佐藤 花子', department: '人事部' },
  { id: '00003', name: '鈴木 一郎', department: '営業部' },
]

export const TargetId: StoryObj<typeof RemoteDrawerTrigger> = {
  name: 'targetId',
  render: () => (
    <Table>
      <thead>
        <tr>
          <Th>社員番号</Th>
          <Th>氏名</Th>
          <Th>部署</Th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee.id}>
            <Td>{employee.id}</Td>
            <Td>
              <RemoteDrawerTrigger targetId={`employee-${employee.id}`}>
                <Button size="S">{employee.name}</Button>
              </RemoteDrawerTrigger>
              <Drawer id={`employee-${employee.id}`} size="S">
                <DrawerHeader subtitle={employee.id} title={employee.name} />
                <DrawerBody>
                  <p>部署: {employee.department}</p>
                </DrawerBody>
              </Drawer>
            </Td>
            <Td>{employee.department}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  ),
}

export const Disabled: StoryObj<typeof RemoteDrawerTrigger> = {
  render: (args) => {
    const id = useId()

    return (
      <>
        <RemoteDrawerTrigger {...args} targetId={id}>
          <Button disabled>ドロワーを開く（disabled）</Button>
        </RemoteDrawerTrigger>
        <Drawer id={id} size="S">
          <DrawerHeader title="リモートトリガードロワー" />
        </Drawer>
      </>
    )
  },
}
