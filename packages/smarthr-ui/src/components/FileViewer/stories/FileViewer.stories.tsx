import { FileViewer } from '..'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/FileViewer',
  component: FileViewer,
  render: (args) => (
    <div className="shr-h-[90vh]">
      <FileViewer {...args} />
    </div>
  ),
  argTypes: {
    file: {
      control: 'select',
      options: ['Japanese PDF', 'English PDF (long, multuple pages)', 'JPEG', 'PNG'],
      mapping: {
        'Japanese PDF': {
          url: '/fixtures/sample-japanese-pdf.pdf',
          contentType: 'application/pdf',
        },
        'English PDF (long, multuple pages)': {
          url: '/fixtures/sample-english-pdf.pdf',
          contentType: 'application/pdf',
        },
        JPEG: {
          url: '/fixtures/sample-jpeg.jpg',
          contentType: 'image/jpeg',
          alt: 'SmartHR (スマートエイチアール) ロゴ',
        },
        PNG: {
          url: '/fixtures/sample-png.png',
          contentType: 'image/png',
          alt: 'SmartHR (スマートエイチアール) ロゴ',
        },
      },
    },
  },
  args: {
    file: {
      url: '/fixtures/sample-japanese-pdf.pdf',
      contentType: 'application/pdf',
    },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FileViewer>

type Story = StoryObj<typeof FileViewer>

export const Playground: Story = {
  args: {},
}

export const width: Story = {
  name: 'width',
  args: {
    width: 80,
  },
}

export const ScaleSteps: Story = {
  name: 'scaleSteps',
  args: {
    scaleSteps: [0.5, 1, 1.5, 2],
  },
}

export const ScaleStep: Story = {
  name: 'scaleStep',
  args: {
    scaleStep: 1,
  },
}
