import { Button } from '../../Button'
import { FaCircleQuestionIcon, FaPencilIcon } from '../../Icon'
import { Cluster, Stack } from '../../Layout'
import { Tooltip } from '../client/components'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

const _messages = {
  'テキスト（sting）': 'メッセージ',
  '複数行（string）':
    'メッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージメッセージ',
  '複数行（ReactNode）': (
    <>
      複数行
      <br />
      メッセージ
      <br />
      複数行
      <br />
      メッセージ
      <br />
      複数行
      <br />
      メッセージ
      <br />
      複数行
      <br />
      メッセージ
    </>
  ),
}

export default {
  title: 'Components/Tooltip',
  component: Tooltip,
  render: (args) => (
    <div className="shr-relative shr-w-full" style={{ height: '250px' }}>
      <div className="shr-absolute shr-left-0 shr-top-0">
        <Tooltip {...args} />
      </div>
      <div className="shr-absolute shr-right-0 shr-top-0">
        <Tooltip {...args} />
      </div>
      <div className="shr-absolute shr-right-0 shr-top-0">
        <Tooltip {...args} />
      </div>
      <div className="shr-absolute" style={{ top: '40%', left: '40%' }}>
        <Tooltip {...args} />
      </div>
      <div className="shr-absolute shr-bottom-0 shr-left-0">
        <Tooltip {...args} />
      </div>
      <div className="shr-absolute shr-bottom-0 shr-right-0">
        <Tooltip {...args} />
      </div>
    </div>
  ),
  argTypes: {
    message: {
      control: 'radio',
      options: Object.keys(_messages),
      mapping: _messages,
    },
  },
  args: {
    message: 'ツールチップ',
    children: 'ツールチップ',
    vertical: 'auto',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Tooltip>

export const Playground: StoryObj<typeof Tooltip> = {
  args: {},
}

export const Message: StoryObj<typeof Tooltip> = {
  name: 'message',
  args: {
    message: 'ツールチップに表示したいメッセージ',
  },
}

export const TriggerType: StoryObj<typeof Tooltip> = {
  name: 'triggerType',
  args: {
    triggerType: 'icon',
    children: <FaCircleQuestionIcon alt="ツールチップ" />,
  },
}

export const EllipsisOnly: StoryObj<typeof Tooltip> = {
  name: 'ellipsisOnly',
  render: (args) => (
    <div className="shr-w-[5em]">
      <Tooltip {...args}>
        <span className="shr-inline-block shr-max-w-full shr-overflow-hidden shr-text-ellipsis shr-text-nowrap">
          省略されるメッセージ
        </span>
      </Tooltip>
    </div>
  ),
  args: {
    message: '省略されるメッセージ',
    ellipsisOnly: true,
  },
}

export const TabIndex: StoryObj<typeof Tooltip> = {
  name: 'tabIndex',
  args: {
    tabIndex: -1, // キーボードアクセスできなくなるため、良い例ではない
  },
}

export const Type: StoryObj<typeof Tooltip> = {
  name: 'type',
  render: () => (
    <Stack>
      <div>
        description(default):
        <Tooltip message="description">
          <Button>ボタン</Button>
        </Tooltip>
      </div>
      <div>
        label:
        <Tooltip type="label" triggerType="icon" message="label">
          <Button>
            <FaPencilIcon />
          </Button>
        </Tooltip>
      </div>
    </Stack>
  ),
}

export const AriaDescribedbyTarget: StoryObj<typeof Tooltip> = {
  name: 'ariaDescribedbyTarget',
  render: () => (
    <Stack>
      <Cluster>
        wrapper + focusable:
        <Tooltip ariaDescribedbyTarget="wrapper" message="wrapper + focusable">
          <Button>ボタン</Button>
        </Tooltip>
      </Cluster>
      <Cluster>
        wrapper + non-focusable:
        <Tooltip ariaDescribedbyTarget="wrapper" message="wrapper + non-focusable">
          テキスト
        </Tooltip>
      </Cluster>
      <Cluster>
        inner + focusable:
        <Tooltip ariaDescribedbyTarget="inner" message="inner + focusable">
          <Button>ボタン</Button>
        </Tooltip>
      </Cluster>
      <Cluster>
        inner + non-focusable:
        <Tooltip triggerType="icon" ariaDescribedbyTarget="inner" message="inner + non-focusable">
          <FaCircleQuestionIcon alt="ツールチップ" />
        </Tooltip>
      </Cluster>
    </Stack>
  ),
}
