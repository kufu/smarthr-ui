import { useRef, useState } from 'react'

import { Button } from '../../../Button'
import { Chip } from '../../../Chip'
import { FormControl } from '../../../FormGroup'
import { FaPaperclipIcon } from '../../../Icon'
import { Cluster, Stack } from '../../../Layout'
import { StatusLabel } from '../../../StatusLabel'
import { TokenTextarea, type TokenTextareaHandle, type TokenTextareaSegment } from '../client'

import type { Meta, StoryObj } from '@storybook/react-vite'

const TOKENS = [
  { value: 'employee_name', label: 'クッっっっっっっっっっっっっっっっっそ長い長い長い氏名' },
  { value: 'department', label: '部署' },
  { value: 'joined_at', label: '入社日' },
  { value: 'company_name', label: '会社名' },
]

const DEFAULT_VALUE: TokenTextareaSegment[] = [
  TOKENS[0],
  'さん\n\n',
  TOKENS[3],
  'へのご入社おめでとうございます。\n',
  TOKENS[1],
  'への配属は',
  TOKENS[2],
  'からです。',
]

const meta = {
  title: 'Experimental/TokenTextarea',
  component: TokenTextarea,
  render: (args) => {
    const ref = useRef<TokenTextareaHandle>(null)
    const [value, setValue] = useState<TokenTextareaSegment[]>(args.defaultValue ?? [])

    return (
      <Stack>
        <FormControl label="本文">
          <TokenTextarea
            {...args}
            ref={ref}
            name="body"
            onChange={(v) => {
              setValue(v)
              args.onChange?.(v)
            }}
          />
        </FormControl>
        <Cluster>
          {TOKENS.map((token) => (
            <Button key={token.value} size="S" onClick={() => ref.current?.insertToken(token)}>
              {token.label}を挿入
            </Button>
          ))}
        </Cluster>
        <pre className="shr-m-0 shr-text-sm" data-testid="value">
          {JSON.stringify(value, null, 2)}
        </pre>
      </Stack>
    )
  },
  args: {
    defaultValue: DEFAULT_VALUE,
    width: 480,
  },
  argTypes: {
    value: { control: false },
    defaultValue: { control: false },
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof TokenTextarea>

export default meta

export const Playground: StoryObj<typeof TokenTextarea> = {}

// トークンで始まる行・終わる行・トークンだけの行など、キャレット操作の確認用
export const TokenPositions: StoryObj<typeof TokenTextarea> = {
  args: {
    defaultValue: [TOKENS[0], 'さん\nあ', TOKENS[1], '\n', TOKENS[2], '\nい', TOKENS[3], 'う'],
  },
}

// トークンの見た目は renderToken で自由に描ける。見た目は操作を受け付けず、読み上げには label が使われる
export const RenderToken: StoryObj<typeof TokenTextarea> = {
  name: 'renderToken',
  args: {
    renderToken: (token) => {
      switch (token.value) {
        case 'department':
          return <StatusLabel type="blue">{token.label}</StatusLabel>
        case 'joined_at':
          return (
            <Chip color="green">
              <FaPaperclipIcon alt="" /> {token.label}
            </Chip>
          )
        default:
          return <Chip>{token.label}</Chip>
      }
    },
  },
}

export const Empty: StoryObj<typeof TokenTextarea> = {
  args: { defaultValue: [] },
}

export const MaxRows: StoryObj<typeof TokenTextarea> = {
  name: 'maxRows',
  args: { rows: 3, maxRows: 5 },
}

export const Error: StoryObj<typeof TokenTextarea> = {
  name: 'error',
  args: { error: true },
}

export const Disabled: StoryObj<typeof TokenTextarea> = {
  name: 'disabled',
  args: { disabled: true },
}
