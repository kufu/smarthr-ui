import { FileViewer } from '../'

import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '../../Layout'

export default {
  title: 'Components/FileViewer/VRT',
  render: () => (
    <Stack className="shr-h-[90vh]">
      <div className="shr-h-[25%]">
        <FileViewer
          file={{
            url: '/fixtures/sample-japanese-pdf.pdf',
            contentType: 'application/pdf',
          }}
        />
      </div>
      <div className="shr-h-[25%]">
        <FileViewer
          file={{
            url: '/fixtures/sample-japanese-pdf.pdf',
            contentType: 'application/pdf',
          }}
          width={80}
        />
      </div>
      <div className="shr-h-[25%]">
        <FileViewer
          file={{
            url: '/fixtures/sample-png.png',
            contentType: 'image/png',
            alt: 'SmartHR (スマートエイチアール) ロゴ',
          }}
        />
      </div>
      <div className="shr-h-[25%]">
        <FileViewer
          file={{
            url: '/fixtures/sample-png.png',
            contentType: 'image/png',
            alt: 'SmartHR (スマートエイチアール) ロゴ',
          }}
          width={80}
        />
      </div>
    </Stack>
  ),
  argTypes: {
    file: {
      control: 'select',
      options: ['Japanese PDF', 'English PDF (long, multiple pages)', 'JPEG', 'PNG'],
      mapping: {
        'Japanese PDF': {
          url: '/fixtures/sample-japanese-pdf.pdf',
          contentType: 'application/pdf',
        },
        'English PDF (long, multiple pages)': {
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
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof FileViewer>

export const VRT = {}

export const VRTForcedColors: StoryObj = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
