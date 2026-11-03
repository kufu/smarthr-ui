import { type ReactNode, useState } from 'react'

import { Button } from '../../Button'
import { FormControl } from '../../FormGroup'
import { Input } from '../../Input'
import { Cluster, Stack } from '../../Layout'
import { Table, Td, Th } from '../../Table'
import { DrawerBody } from '../DrawerBody'
import { DrawerFooter } from '../DrawerFooter'
import { InlineDrawerLayout } from '../InlineDrawerLayout'
import { DrawerHeader, InlineDrawer } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

const ROWS = Array.from({ length: 500 }, (_, i) => i + 1)
const COLUMNS = [
  '社員番号',
  '氏名',
  '部署',
  '役職',
  '雇用形態',
  '入社日',
  'メールアドレス',
  '勤務地',
]

const MainTable = () => (
  <Table>
    <thead>
      <tr>
        {COLUMNS.map((column) => (
          <Th key={column}>{column}</Th>
        ))}
      </tr>
    </thead>
    <tbody>
      {ROWS.map((row) => (
        <tr key={row}>
          <Td>{String(row).padStart(5, '0')}</Td>
          <Td>従業員 {row}</Td>
          <Td>開発部</Td>
          <Td>メンバー</Td>
          <Td>正社員</Td>
          <Td>2020/04/01</Td>
          <Td>employee{row}@example.com</Td>
          <Td>東京</Td>
        </tr>
      ))}
    </tbody>
  </Table>
)

const FilterPanel = ({ onClickClose }: { onClickClose: () => void }) => (
  <>
    <DrawerHeader title="絞り込み" />
    <DrawerBody>
      <Stack>
        <FormControl label="キーワード">
          <Input name="keyword" />
        </FormControl>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i}>絞り込み条件 {i + 1}</p>
        ))}
      </Stack>
    </DrawerBody>
    <DrawerFooter>
      <Button variant="primary" onClick={onClickClose}>
        適用
      </Button>
    </DrawerFooter>
  </>
)

const DetailPanel = () => (
  <>
    <DrawerHeader title="詳細" />
    <DrawerBody>
      <p>選択した従業員の詳細です。</p>
    </DrawerBody>
  </>
)

const Frame = ({ children }: { children: ReactNode }) => (
  <div style={{ height: '40rem', border: '1px solid #ccc' }}>{children}</div>
)

const LEFT_ID = 'inline-drawer-left'
const RIGHT_ID = 'inline-drawer-right'

const Template = ({
  initialLeft = false,
  initialRight = false,
}: {
  initialLeft?: boolean
  initialRight?: boolean
}) => {
  const [isLeftOpen, setIsLeftOpen] = useState(initialLeft)
  const [isRightOpen, setIsRightOpen] = useState(initialRight)

  return (
    <Frame>
      <InlineDrawerLayout
        left={
          <InlineDrawer id={LEFT_ID} isOpen={isLeftOpen} onClickClose={() => setIsLeftOpen(false)}>
            <FilterPanel onClickClose={() => setIsLeftOpen(false)} />
          </InlineDrawer>
        }
        right={
          <InlineDrawer
            id={RIGHT_ID}
            isOpen={isRightOpen}
            size="M"
            onClickClose={() => setIsRightOpen(false)}
          >
            <DetailPanel />
          </InlineDrawer>
        }
      >
        <Stack className="shr-p-1">
          <Cluster>
            <Button
              aria-expanded={isLeftOpen}
              aria-controls={LEFT_ID}
              onClick={() => setIsLeftOpen((v) => !v)}
            >
              絞り込み
            </Button>
            <Button
              aria-expanded={isRightOpen}
              aria-controls={RIGHT_ID}
              onClick={() => setIsRightOpen((v) => !v)}
            >
              詳細
            </Button>
          </Cluster>
          <MainTable />
        </Stack>
      </InlineDrawerLayout>
    </Frame>
  )
}

export default {
  title: 'Components/Drawer/InlineDrawer',
  component: InlineDrawer,
  subcomponents: {
    InlineDrawerLayout,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} as Meta<typeof InlineDrawer>

export const Playground: StoryObj<typeof InlineDrawer> = {
  render: () => <Template />,
}

export const InitiallyOpen: StoryObj<typeof InlineDrawer> = {
  name: 'isOpen が最初から true',
  render: () => <Template initialLeft initialRight />,
}
