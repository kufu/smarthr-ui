import React from 'react'

import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { Text } from '../../Text'
import { BulkActionRow } from '../BulkActionRow'
import { Table } from '../Table'
import { TableReel } from '../TableReel'
import { Td } from '../Td'
import { TdCheckbox } from '../TdCheckbox'
import { Th } from '../Th'
import { ThCheckbox } from '../ThCheckbox'
import { WakuWakuButton } from '../WakuWakuButton'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/Table/VRT',
  render: (args) => (
    <Stack>
      {[undefined, true].map((fixed) =>
        [undefined, 'both'].map((borderType) => {
          const Wrapper = fixed ? TableReel : React.Fragment
          const wrapperProps = fixed ? { className: 'shr-w-[50vw]' } : {}
          return (
            <Wrapper {...wrapperProps} key={String(fixed)}>
              <Table {...args} borderType={borderType as any}>
                <thead>
                  <tr>
                    <ThCheckbox name="thead_checkbox" mixed checked />
                    {[...Array(10)].map((_, i) => (
                      <Th
                        align={i === 2 ? 'right' : undefined}
                        sort={i === 0 ? 'asc' : i === 1 ? 'desc' : i === 2 ? 'none' : undefined}
                        key={i}
                      >
                        表頭{i + 1}
                      </Th>
                    ))}
                    <Th fixed={fixed}>操作</Th>
                  </tr>
                  <BulkActionRow>
                    <Cluster inline align="center" className="shr-sticky shr-left-1">
                      <p>n件のオブジェクトが選択されています。</p>
                      <WakuWakuButton>一覧のオブジェクト9,999件すべてを選択</WakuWakuButton>
                    </Cluster>
                  </BulkActionRow>
                </thead>
                <tbody>
                  {[...Array(10)].map((_, i) => (
                    <tr key={i}>
                      <TdCheckbox
                        checked={i % 2 === 0}
                        aria-labelledby={`td_${fixed}_${borderType}_${i + 1}_1`}
                        name="tbody_checkbox"
                      />
                      {[...Array(10)].map((__, j) => (
                        <Td
                          align={j === 2 ? 'right' : undefined}
                          id={`td_${fixed}_${borderType}_${i + 1}_${j + 1}`}
                          key={j}
                        >
                          <Text whiteSpace="nowrap">
                            表データ{i + 1}-{j + 1}
                          </Text>
                        </Td>
                      ))}
                      <Td fixed={fixed}>
                        <Button size="s">操作</Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Wrapper>
          )
        }),
      )}
    </Stack>
  ),
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Table>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
