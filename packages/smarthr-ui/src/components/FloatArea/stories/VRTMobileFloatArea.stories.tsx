import { Button } from '../../Button'
import { Stack } from '../../Layout'
import { Panel } from '../../Panel'
import { FloatArea } from '../FloatArea'

import type { Meta } from '@storybook/react-vite'

export default {
  title: 'Components/FloatArea/VRT Mobile',
  render: (args) => (
    <Stack gap={1.5}>
      <Stack>
        {[...Array(15)].map((_, index) => (
          <Panel key={index} padding={1.5}>
            <div className="shr-h-2" />
          </Panel>
        ))}
      </Stack>
      <FloatArea
        {...args}
        responseStatus={{ status: 'error', text: '入力に誤りがあります。' }}
        primaryButton={<Button variant="primary">保存</Button>}
        secondaryButton={<Button>キャンセル</Button>}
        tertiaryButton={<Button>プレビュー</Button>}
      />
    </Stack>
  ),
  globals: {
    viewport: { value: 'vrtMobile' },
  },
  parameters: {
    chromatic: {
      disableSnapshot: false,
      modes: {
        vrtMobile: { viewport: 'vrtMobile' },
      },
    },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof FloatArea>

export const Default = {}
