/* eslint-disable smarthr/a11y-input-in-form-control */
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React from 'react'

import { Stack } from '../../../Layout'
import { SingleComboBox } from '../SingleComboBox'

import { defaultItems, prefixes } from './SingleComboBox.stories'

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

const playSingle = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textboxes = await canvas.findAllByRole('combobox')
  await textboxes[textboxes.length - 1].focus()
  const body = canvasElement.ownerDocument.body
  const option = await within(body).findByText('option 1')
  await userEvent.hover(option)
  const helpMessage = await within(body).findAllByText('入力でフィルタリングできます。')
  await userEvent.click(helpMessage[0]) // カーソルの点滅によるVRTのフレーキーを避けるためにフォーカスを移動する
}

export default {
  title: 'Forms（フォーム）/SingleComboBox/VRT',
  component: SingleComboBox,
  render: (args) => (
    <Stack align="flex-start" gap={2} className="shr-h-screen">
      {_cases.map((props, i) => (
        <SingleComboBox {...args} {...props} items={Object.values(defaultItems)} key={i} />
      ))}
      <SingleComboBox
        {...args}
        name="default"
        items={Object.values(defaultItems)}
        dropdownHelpMessage="入力でフィルタリングできます。"
        selectedItem={null}
      />
    </Stack>
  ),
  play: playSingle,
  parameters: {
    withTheming: true,
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} as Meta<typeof SingleComboBox>

export const VRT: StoryObj<typeof SingleComboBox> = {}

export const VRTForcedColors: StoryObj<typeof SingleComboBox> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
