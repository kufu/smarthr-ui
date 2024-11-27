import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'

import { FormControl } from '../../../FormControl'
import { FaCirclePlusIcon } from '../../../Icon'
import { Stack } from '../../../Layout'
import { SingleComboBox } from '../SingleComboBox'

const defaultItems = {
  'option 1': {
    label: 'option 1',
    value: 'value-1',
    data: {
      name: 'test',
      age: 23,
    },
  },
  'option 2': {
    label: 'option 2',
    value: 'value-2',
    data: {
      name: 'test 2',
      age: 34,
    },
  },
  'option 3': {
    label: 'option 3',
    value: 'value-3',
    disabled: true,
  },
  'option 4': {
    label: 'option 4',
    value: 'value-4',
  },
  'option 5': {
    label: 'option 5',
    value: 'value-5',
  },
  'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）': {
    label: 'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）',
    value: 'value-6',
  },
  アイテムのラベルがReactNodeの場合: {
    label: (
      <Stack as="span" gap={0.25}>
        <span>アイテムのラベルがReactNodeの場合</span>
        <span>（ダミーテキストダミーテキストダミーテキストダミーテキスト）</span>
      </Stack>
    ),
    value: 'value-7',
  },
}

const prefixes = { なし: '', あり: <FaCirclePlusIcon /> }

/* pict singleComboBox.pict
 * disabled        error   width   prefix  selectedItem
 * false   false   なし    なし    あり
 * false   true    あり    あり    なし
 * true    true    あり    なし    あり
 * true    false   あり    あり    なし
 * true    true    なし    なし    なし
 * true    false   なし    あり    あり
 */

const _cases: Array<Omit<Parameters<typeof SingleComboBox>[0], 'items'>> = [
  {
    disabled: false,
    error: false,
    width: undefined,
    prefix: undefined,
    selectedItem: defaultItems['option 1'],
  },
  { disabled: false, error: true, width: '15em', prefix: prefixes['あり'], selectedItem: null },
  {
    disabled: true,
    error: true,
    width: '15em',
    prefix: undefined,
    selectedItem:
      defaultItems[
        'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）'
      ],
  },
  { disabled: true, error: false, width: '15em', prefix: prefixes['あり'], selectedItem: null },
  { disabled: true, error: true, width: undefined, prefix: undefined, selectedItem: null },
  {
    disabled: true,
    error: false,
    width: undefined,
    prefix: prefixes['あり'],
    selectedItem: defaultItems['アイテムのラベルがReactNodeの場合'],
  },
]

export default {
  title: 'Forms（フォーム）/SingleComboBox/VRT',
  component: SingleComboBox,
  render: (args) => (
    <Stack align="flex-start" gap={2}>
      <form>
        <FormControl className="shr-mb-[15rem]" title="デフォルト" dangerouslyTitleHidden>
          <SingleComboBox
            name="default"
            items={Object.values(defaultItems)}
            dropdownHelpMessage="入力でフィルタリングできます。"
            selectedItem={null}
          />
        </FormControl>
      </form>
      {[undefined, 'hover', 'focus-visible'].map((id) => (
        <Stack id={id} align="flex-start" key={id}>
          {_cases.map((props, i) => (
            <form key={i}>
              <FormControl title="VRT 用の Story です" dangerouslyTitleHidden>
                <SingleComboBox {...args} {...props} items={Object.values(defaultItems)} />
              </FormControl>
            </form>
          ))}
        </Stack>
      ))}
    </Stack>
  ),
  args: {
    items: Object.values(defaultItems),
  },
  parameters: {
    withTheming: true,
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} as Meta<typeof SingleComboBox>

export const VRT: StoryObj<typeof SingleComboBox> = {}

const playSingle = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textboxes = await canvas.findAllByRole('combobox')
  await textboxes[0].focus()
  const body = canvasElement.ownerDocument.body
  const option = await within(body).findByText('option 1')
  await userEvent.hover(option)
  const helpMessage = await within(body).findAllByText('入力でフィルタリングできます。')
  await userEvent.click(helpMessage[0]) // カーソルの点滅によるVRTのフレーキーを避けるためにフォーカスを移動する
}

VRT.play = playSingle

export const VRTForcedColors: StoryObj<typeof SingleComboBox> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
