import { FileViewer } from '..'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Data Display（データ表示）/FileViewer',
  component: FileViewer,
  render: (args) => (
    <div className="shr-h-[90vh]">
      <FileViewer {...args} />
    </div>
  ),
  args: {
    url: '/fixtures/example.pdf',
    contentType: 'application/pdf',
    filename: 'sample.pdf',
    width: 600,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FileViewer>

type Story = StoryObj<typeof FileViewer>

export const Playground: Story = {
  args: {},
}
