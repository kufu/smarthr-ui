import React from 'react'

import { Cluster } from '../../Layout'
import { BulkActionRow } from '../BulkActionRow'
import { Table } from '../Table'
import { WakuWakuButton } from '../WakuWakuButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Table/WakuWakuButton',
  component: WakuWakuButton,
  render: (args) => (
    <Table>
      <thead>
        <BulkActionRow>
          <Cluster align="center">
            <p>n件のオブジェクトが選択されています。</p>
            <WakuWakuButton {...args}>一覧のオブジェクト9,999件すべてを選択</WakuWakuButton>
          </Cluster>
        </BulkActionRow>
      </thead>
    </Table>
  ),
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof WakuWakuButton>

export const Playground: StoryObj<typeof WakuWakuButton> = {}
