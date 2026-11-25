import { type FC, useState } from 'react'
import { userEvent, within } from 'storybook/test'

import { Button } from '../../Button'
import { FaCircleQuestionIcon, FaPencilIcon } from '../../Icon'
import { Stack } from '../../Layout'
import { Tooltip } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/Tooltip/VRT',
  render: (args) => (
    <Stack gap={8} align="flex-start" className="shr-p-4">
      <Tooltip {...args} triggerType="icon">
        <FaCircleQuestionIcon alt="ツールチップ" />
      </Tooltip>
      <Tooltip
        {...args}
        message={
          <>
            複数行の
            <br />
            メッセージ
          </>
        }
      />
      <div className="shr-w-[5em]">
        <Tooltip {...args} ellipsisOnly>
          <span className="shr-inline-block shr-max-w-full shr-overflow-hidden shr-text-ellipsis shr-text-nowrap">
            省略されるメッセージ
          </span>
        </Tooltip>
      </div>
      {/* eslint-disable-next-line smarthr/best-practice-for-default-props -- typeのバリエーションを網羅するVRTのため */}
      <Tooltip type="description" message="description">
        <Button>ボタン</Button>
      </Tooltip>
      <Tooltip type="label" triggerType="icon" message="label">
        <Button>
          <FaPencilIcon />
        </Button>
      </Tooltip>
      {/* eslint-disable-next-line smarthr/best-practice-for-default-props -- ariaDescribedbyTargetのバリエーションを網羅するVRTのため */}
      <Tooltip ariaDescribedbyTarget="wrapper" message="wrapper + focusable">
        <Button>ボタン</Button>
      </Tooltip>
      {/* eslint-disable-next-line smarthr/best-practice-for-default-props -- ariaDescribedbyTargetのバリエーションを網羅するVRTのため */}
      <Tooltip ariaDescribedbyTarget="wrapper" message="wrapper + non-focusable">
        テキスト
      </Tooltip>
      <Tooltip ariaDescribedbyTarget="inner" message="inner + focusable">
        <Button>ボタン</Button>
      </Tooltip>
      <Tooltip triggerType="icon" ariaDescribedbyTarget="inner" message="inner + non-focusable">
        <FaCircleQuestionIcon alt="ツールチップ" />
      </Tooltip>
    </Stack>
  ),
  args: {
    message: 'ツールチップ',
    children: 'ツールチップ',
    vertical: 'auto',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  play: ({ canvasElement }) => {
    const tooltips = canvasElement.querySelectorAll('.smarthr-ui-Tooltip')
    tooltips.forEach((tooltip) => userEvent.hover(tooltip))
  },
  tags: ['!autodocs'],
} as Meta<typeof Tooltip>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}

const MessageChangeWhileOpen: FC = () => {
  const [names, setNames] = useState(['ユーザー1'])

  return (
    // HINT: トリガの上側にツールチップが表示されるよう、上に余白を空ける
    <div className="shr-p-4 shr-pt-[200px]">
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
  )
}

// 開いたまま中身が変わって高さが増えても、トリガの上側に表示したツールチップが上に伸び、トリガに重ならないことを確認する
export const VRTMessageChangeWhileOpen: StoryObj = {
  render: () => <MessageChangeWhileOpen />,
  play: async ({ canvasElement }) => {
    const button = await within(canvasElement).findByRole('button')

    await userEvent.hover(button)
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)

    // ResizeObserverによる位置の再計算を待つ
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
  },
}
