import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../../Button'
import { FileViewer } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

export default {
  title: 'Components/FileViewer',
  component: FileViewer,
  render: (args) => (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div tabIndex={0} className="shr-h-[90vh] shr-w-full shr-resize shr-overflow-auto">
      <FileViewer {...args} />
    </div>
  ),
  argTypes: {
    file: {
      control: 'select',
      options: [
        'Japanese PDF',
        'English PDF (long, multiple pages)',
        'JPEG 2000 in PDF',
        'JPEG',
        'PNG',
      ],
      mapping: {
        'Japanese PDF': {
          url: '/fixtures/sample-japanese-pdf.pdf',
          contentType: 'application/pdf',
        },
        // HINT: PDFViewerのoptions.wasmUrl設定が正しく機能しているかの確認に使う
        'JPEG 2000 in PDF': {
          url: '/fixtures/sample-jpeg2000-pdf.pdf',
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
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof FileViewer>

type Story = StoryObj<typeof FileViewer>

export const Playground: Story = {
  args: {},
}

export const Width: Story = {
  name: 'width',
  args: {
    width: 80,
  },
}

const previewImage = {
  url: '/fixtures/sample-png.png',
  contentType: 'image/png',
  alt: 'プレビュー画像',
}

const WidthChangesExample = () => {
  const [width, setWidth] = useState<number | undefined>(320)
  const [containerWidth, setContainerWidth] = useState(800)

  return (
    <>
      <Button onClick={() => setWidth(640)}>幅を640pxに変更</Button>
      <Button onClick={() => setWidth(undefined)}>幅を自動に設定</Button>
      <Button onClick={() => setContainerWidth(700)}>コンテナを700pxに変更</Button>
      <Button onClick={() => setWidth(360)}>幅を360pxに変更</Button>
      <div style={{ width: containerWidth, height: 400 }}>
        <FileViewer file={previewImage} width={width} />
      </div>
    </>
  )
}

export const VRTWidthChanges: Story = {
  render: () => <WidthChangesExample />,
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: false },
    throwPlayFunctionExceptions: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const image = await canvas.findByRole('img', { name: 'プレビュー画像' })
    const expectImageWidth = (width: number) =>
      waitFor(() => expect(image.getBoundingClientRect().width).toBeCloseTo(width))

    await expectImageWidth(320)
    await userEvent.click(canvas.getByRole('button', { name: '幅を640pxに変更' }))
    await expectImageWidth(640)
    await userEvent.click(canvas.getByRole('button', { name: '幅を自動に設定' }))
    await expectImageWidth(736)
    await userEvent.click(canvas.getByRole('button', { name: 'コンテナを700pxに変更' }))
    await expectImageWidth(636)
    await userEvent.click(canvas.getByRole('button', { name: '幅を360pxに変更' }))
    await expectImageWidth(360)
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

export const Searchable: Story = {
  name: 'searchable',
  args: {
    searchable: false,
  },
}
