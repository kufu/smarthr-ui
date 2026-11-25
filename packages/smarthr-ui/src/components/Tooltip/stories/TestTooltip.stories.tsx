import { useState } from 'react'

import { Button } from '../../Button'
import { InformationPanel } from '../../InformationPanel'
import { Stack } from '../../Layout'
import { Tooltip } from '../client'

import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Components/Tooltip/Test',
  component: Tooltip,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof Tooltip>

export const ManualTest1 = () => {
  const [names, setNames] = useState(['ユーザー1'])

  return (
    <Stack>
      <InformationPanel heading="表示中に中身が変わった場合のテスト">
        <ol className="shr-ms-1.5">
          <li>「開いたまま中身を増やす」ボタンにマウスを乗せ、ツールチップを表示してください。</li>
          <li>
            マウスを乗せたまま、ボタンを何度か押してください。押すたびに中身が1行ずつ増えます。
          </li>
          <li>ツールチップが上に伸び、ボタンに重ならないことを確認してください。</li>
          <li>
            さらにボタンを押し続け、上側に収まらなくなったら、ツールチップがボタンの下側に移るか、画面からはみ出さずに中身をスクロールできるようになることを確認してください（どちらになるかは画面の大きさによって変わります）。
          </li>
        </ol>
      </InformationPanel>
      <div>
        <Tooltip
          message={names.map((name) => (
            <div key={name}>{name}</div>
          ))}
        >
          <Button
            onClick={() => setNames((current) => [...current, `ユーザー${current.length + 1}`])}
          >
            開いたまま中身を増やす
          </Button>
        </Tooltip>
      </div>
    </Stack>
  )
}

const _manyNames = Array.from({ length: 100 }, (_, i) => `ユーザー${i + 1}`)

export const ManualTest2 = () => (
  <Stack>
    <InformationPanel heading="中身が表示できる領域より大きい場合のテスト">
      <ol className="shr-ms-1.5">
        <li>「100人分のツールチップ」ボタンにマウスを乗せ、ツールチップを表示してください。</li>
        <li>ツールチップがボタンに重ならず、画面の外にはみ出さないことを確認してください。</li>
        <li>
          吹き出しの矢印の上を通ってツールチップの中にマウスを移し、中身をスクロールして最後の「ユーザー100」まで表示できることを確認してください。
        </li>
      </ol>
    </InformationPanel>
    <div>
      <Tooltip
        message={_manyNames.map((name) => (
          <div key={name}>{name}</div>
        ))}
      >
        <Button>100人分のツールチップ</Button>
      </Tooltip>
    </div>
  </Stack>
)
