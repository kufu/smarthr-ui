import { Fragment } from 'react'

import { Button } from '../../Button'
import { Cluster, Stack } from '../../Layout'
import { Text } from '../../Text'
import { BulkActionRow } from '../BulkActionRow'
import { Table } from '../Table'
import { TableReel } from '../TableReel'
import { Td } from '../Td'
import { TdCheckbox } from '../TdCheckbox'
import { TdRadioButton } from '../TdRadioButton'
import { Th } from '../Th'
import { ThCheckbox } from '../ThCheckbox'
import { WakuWakuButton } from '../WakuWakuButton'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/Table/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'left', 'right'].map((fixed) =>
        [undefined, 'both'].map((borderType) => {
          const Wrapper = fixed ? TableReel : Fragment
          const wrapperProps = fixed ? { className: 'shr-w-[50vw]' } : {}
          return (
            <Wrapper {...wrapperProps} key={String(fixed)}>
              <Table {...args} borderType={borderType as any}>
                <thead>
                  <tr>
                    {fixed === 'left' && <Th fixed={fixed}>操作</Th>}
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
                    {fixed === 'right' && <Th fixed={fixed}>操作</Th>}
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
                      {fixed === 'left' && (
                        <Td fixed={fixed}>
                          <Button size="s">操作</Button>
                        </Td>
                      )}
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
                      {fixed === 'right' && (
                        <Td fixed={fixed}>
                          <Button size="s">操作</Button>
                        </Td>
                      )}
                    </tr>
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <tr key={i}>
                      {fixed === 'left' && (
                        <Td fixed={fixed}>
                          <Button size="s">操作</Button>
                        </Td>
                      )}
                      <TdRadioButton
                        checked={i === 0}
                        aria-labelledby={`td_${fixed}_${borderType}_${i + 1}_1`}
                        name={`tbody_radio--${fixed}--${borderType}`}
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
                      {fixed === 'right' && (
                        <Td fixed={fixed}>
                          <Button size="s">操作</Button>
                        </Td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Wrapper>
          )
        }),
      )}
      {[false, true].map((rounded) =>
        ['vertical', 'horizontal', 'both', 'outer', 'all'].map((borderType) =>
          ['solid', 'dashed', 'dotted'].map((borderStyle) => (
            <>
              <Table
                {...args}
                borderType={borderType as any}
                borderStyle={borderStyle as any}
                rounded={rounded}
              >
                <thead>
                  <tr>
                    <Th>オブジェクト名</Th>
                    <Th>オブジェクトの情報1</Th>
                    <Th>オブジェクトの情報2</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>オブジェクト1</Td>
                    <Td>情報1</Td>
                    <Td>2024-11-26</Td>
                  </tr>
                </tbody>
              </Table>
              <Table
                {...args}
                borderType={borderType as any}
                borderStyle={borderStyle as any}
                rounded={rounded}
              >
                <tbody>
                  <tr>
                    <Th>オブジェクト1</Th>
                    <Td>情報1</Td>
                    <Td>2024-11-26</Td>
                  </tr>
                  <tr>
                    <Th>オブジェクト2</Th>
                    <Td>情報2</Td>
                    <Td>2024-11-27</Td>
                  </tr>
                </tbody>
              </Table>
            </>
          )),
        ),
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
