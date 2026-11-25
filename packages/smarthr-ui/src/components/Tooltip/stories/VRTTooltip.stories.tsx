import { expect, userEvent, within } from 'storybook/test'

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

// トリガとツールチップの間の隙間も、ツールチップの一部としてポインタが当たる範囲になっていること
// (隙間でトリガのpointerleaveが発生すると、トリガからツールチップへポインタを移す途中で閉じてしまう)
export const VRTPointerAreaBetweenTriggerAndTooltip: StoryObj = {
  render: () => (
    // HINT: 1つ目のトリガは上に余白を取らず、ツールチップがトリガの下に表示されるようにする
    <Stack gap={8} align="flex-start" className="shr-px-4 shr-pb-4">
      <Tooltip message="トリガの下に表示">
        <Button>下に表示</Button>
      </Tooltip>
      <div className="shr-pt-[100px]">
        <Tooltip message="トリガの上に表示">
          <Button>上に表示</Button>
        </Tooltip>
      </div>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    for (const trigger of within(canvasElement).getAllByRole('button')) {
      await userEvent.hover(trigger)

      const popup = document
        .getElementById(trigger.getAttribute('aria-describedby')!)!
        .closest<HTMLElement>('.smarthr-ui-Tooltip-popup')!
      const triggerRect = trigger.getBoundingClientRect()
      const popupRect = popup.getBoundingClientRect()
      // 隙間の上下方向の中央。横方向は三角(吹き出しの矢印)と重ならない、ツールチップの端に近い位置
      const y =
        popupRect.bottom <= triggerRect.top
          ? (popupRect.bottom + triggerRect.top) / 2
          : (triggerRect.bottom + popupRect.top) / 2
      const x = popupRect.left + 2

      await expect(popup.contains(document.elementFromPoint(x, y))).toBe(true)
    }
  },
  parameters: {
    layout: 'fullscreen',
  },
}
