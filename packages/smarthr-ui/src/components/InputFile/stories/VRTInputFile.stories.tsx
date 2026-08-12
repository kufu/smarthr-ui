import { userEvent } from 'storybook/test'

import { Stack } from '../../Layout'
import { InputFile } from '../InputFile'

import type { Meta, StoryObj } from '@storybook/react-webpack5'

export default {
  title: 'Components/InputFile/VRT',
  render: (args) => (
    <Stack>
      {[undefined, 'hover', 'focus-within'].map((id) => (
        <Stack id={id} key={id}>
          {[undefined, 'M', 'S'].map((size) =>
            [false, true].map((disabled) =>
              [false, true].map((error) => (
                <InputFile
                  {...args}
                  size={size as any}
                  disabled={disabled}
                  error={error}
                  key={`${size}-${disabled}-${error}`}
                />
              )),
            ),
          )}
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    label: 'ファイルを選択',
  },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} satisfies Meta<typeof InputFile>

export const VRT = {
  parameters: {
    pseudo: {
      hover: ['#hover span'],
      focusWithin: ['#focus-within span'],
    },
  },
}

export const VRTForcedColors: StoryObj = {
  parameters: {
    ...VRT.parameters,
    chromatic: { forcedColors: 'active' },
  },
}

const previewablePlay = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const inputs = canvasElement.querySelectorAll<HTMLInputElement>('[data-smarthr-ui-input="true"]')
  const imageFile = new File([''], 'image.png', { type: 'image/png' })
  const pdfFile = new File([''], 'document.pdf', { type: 'application/pdf' })
  const textFile = new File([''], 'text.txt', { type: 'text/plain' })

  for (const input of Array.from(inputs)) {
    await userEvent.upload(input, [imageFile, pdfFile, textFile])
  }
}

export const VRTPreviewable: StoryObj<typeof InputFile> = {
  render: () => (
    <Stack>
      <InputFile label="previewable: false" name="previewablefalse" multiple previewable={false} />
      <InputFile label="previewable: true" name="previewabletrue" multiple previewable />
    </Stack>
  ),
  play: previewablePlay,
}

export const VRTPreviewableForcedColors: StoryObj<typeof InputFile> = {
  render: VRTPreviewable.render,
  play: previewablePlay,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
