import { Stack } from '../../Layout'
import { Textarea } from '../Textarea'

import type { Meta, StoryObj } from '@storybook/react'

export default {
  title: 'Components/Textarea',
  component: Textarea,
  render: (args) => <Textarea {...args} />,
  argTypes: {
    disabled: { description: '非活性', type: 'boolean' },
  },
  args: {},
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof Textarea>

export const Playground: StoryObj<typeof Textarea> = {
  args: {},
}

export const Disabled: StoryObj<typeof Textarea> = {
  name: 'disabled',
  args: {
    disabled: true,
  },
}

export const Error: StoryObj<typeof Textarea> = {
  name: 'error',
  args: {
    error: true,
  },
}

export const Width: StoryObj<typeof Textarea> = {
  name: 'width',
  render: (args) => (
    <Stack align="flex-start">
      {['15em', '50%', 200].map((width) => (
        <Textarea {...args} width={width} key={width} />
      ))}
    </Stack>
  ),
}

export const AutoFocus: StoryObj<typeof Textarea> = {
  name: 'autoFocus',
  args: {
    autoFocus: true,
  },
}

export const AutoResize: StoryObj<typeof Textarea> = {
  name: 'autoResize',
  args: {
    autoResize: true,
  },
}

export const MaxRows: StoryObj<typeof Textarea> = {
  name: 'maxRows',
  args: {
    autoResize: true,
    maxRows: 10,
  },
}

export const Rows: StoryObj<typeof Textarea> = {
  name: 'rows',
  args: {
    rows: 3,
  },
}

export const MaxLetters: StoryObj<typeof Textarea> = {
  name: 'maxLetters',
  args: {
    maxLetters: 100,
  },
}

export const Decorators: StoryObj<typeof Textarea> = {
  name: 'decorators',
  args: {
    decorators: {
      beforeMaxLettersCount: (org) => <>beforeMaxLettersCount({org})</>,
      afterMaxLettersCount: (org) => <>afterMaxLettersCount({org})</>,
      afterMaxLettersCountExceeded: (org) => <>afterMaxLettersCountExceeded({org})</>,
      beforeScreenReaderMaxLettersDescription: (org) => (
        <>beforeScreenReaderMaxLettersDescription({org})</>
      ),
      afterScreenReaderMaxLettersDescription: (org) => (
        <>afterScreenReaderMaxLettersDescription({org})</>
      ),
    },
  },
  render: (args) => (
    <>
      <Textarea {...args} maxLetters={5} value="テキストエ" />
      <Textarea {...args} maxLetters={5} value="テキストエリア" />
    </>
  ),
}

export const Placeholder: StoryObj<typeof Textarea> = {
  name: 'placeholder（非推奨）',
  args: {
    placeholder: 'テキストエリア',
  },
}
