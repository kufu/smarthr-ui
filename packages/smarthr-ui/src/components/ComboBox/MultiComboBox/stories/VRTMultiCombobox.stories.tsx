/* eslint-disable smarthr/a11y-input-in-form-control */
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/test'
import React, { useState } from 'react'

import { Stack } from '../../../Layout'
import { ComboBoxItem } from '../../types'
import { MultiComboBox } from '../MultiComboBox'

import { defaultItems } from './MultiCombobox.stories'

/*
 * pict multiComboBox.pict
 * disabled        error   width   selectedItems
 * false   true    なし    なし
 * false   false   あり    複数
 * true    true    あり    一つ
 * false   false   なし    一つ
 * true    true    なし    複数
 * true    false   あり    なし
 */

const _cases: Array<Omit<Parameters<typeof MultiComboBox>[0], 'items'>> = [
  { disabled: false, error: true, width: undefined, selectedItems: [] },
  {
    disabled: false,
    error: false,
    width: '15em',
    selectedItems: [defaultItems['option 1'], defaultItems['option 4']],
  },
  { disabled: true, error: true, width: '15em', selectedItems: [defaultItems['option 3']] },
  {
    disabled: false,
    error: false,
    width: undefined,
    selectedItems: [defaultItems['アイテムのラベルがReactNodeの場合']],
  },
  {
    disabled: true,
    error: true,
    width: undefined,
    selectedItems: [
      defaultItems['option 2'],
      defaultItems[
        'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）'
      ],
    ],
  },
  { disabled: true, error: false, width: '15em', selectedItems: [] },
]

const waitForRAF = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      resolve()
    })
  })
const playMulti = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const comboboxes = await canvas.findAllByRole('combobox')
  comboboxes[comboboxes.length - 1].focus()
  const body = canvasElement.ownerDocument.body
  const option1 = await within(body).findByRole('button', { name: 'option 1' })
  await userEvent.click(option1)
  await waitForRAF()
  const option2 = await within(body).findByRole('button', { name: 'option 2' })
  await userEvent.click(option2)
  await waitForRAF()
  const helpMessage = await within(body).findAllByText('入力でフィルタリングできます。')
  await userEvent.click(helpMessage[0]) // カーソルの点滅によるVRTのフレーキーを避けるためにフォーカスを移動する
}

export default {
  title: 'Forms（フォーム）/MultiComboBox/VRT',
  component: MultiComboBox,
  render: (args) => {
    const items = Object.values(defaultItems)
    const [selectedItems, setSelectedItems] = useState<Array<ComboBoxItem<unknown>>>([])
    return (
      <Stack align="flex-start" gap={2} className="shr-h-screen">
        {_cases.map((props, i) => (
          <MultiComboBox {...args} {...props} items={items} key={i} />
        ))}
        <MultiComboBox
          {...args}
          name="default"
          items={items}
          dropdownHelpMessage="入力でフィルタリングできます。"
          selectedItems={selectedItems}
          onChangeSelected={(its) => setSelectedItems(its)}
        />
      </Stack>
    )
  },
  play: playMulti,
  parameters: {
    withTheming: true,
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs', 'skip-test-runner'],
} as Meta<typeof MultiComboBox>

export const VRT: StoryObj<typeof MultiComboBox> = {}

export const VRTForcedColors: StoryObj<typeof MultiComboBox> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
