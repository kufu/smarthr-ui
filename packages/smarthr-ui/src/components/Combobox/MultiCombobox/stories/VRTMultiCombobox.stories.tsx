/* eslint-disable smarthr/a11y-input-in-form-control */
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from 'storybook/test'
import { useState } from 'react'

import { Stack } from '../../../Layout'
import { ComboboxItem } from '../../types'
import { MultiCombobox } from '../MultiCombobox'

import { defaultItems } from './MultiCombobox.stories'

/*
 * pict multiCombobox.pict
 * disabled        error   width   selectedItems
 * false   true    なし    なし
 * false   false   あり    複数
 * true    true    あり    一つ
 * false   false   なし    一つ
 * true    true    なし    複数
 * true    false   あり    なし
 */

const _cases: Array<Omit<Parameters<typeof MultiCombobox>[0], 'items'>> = [
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
  const option1 = await within(body).findByRole('option', { name: 'option 1' })
  await userEvent.click(option1)
  await waitForRAF()
  const option2 = await within(body).findByRole('option', { name: 'option 2' })
  await userEvent.click(option2)
  await waitForRAF()
  const helpMessage = await within(body).findAllByText('入力でフィルタリングできます。')
  await userEvent.click(helpMessage[0]) // カーソルの点滅によるVRTのフレーキーを避けるためにフォーカスを移動する
}

export default {
  title: 'Components/Combobox/MultiCombobox/VRT',
  component: MultiCombobox,
  render: (args) => {
    const items = Object.values(defaultItems)
    const [selectedItems, setSelectedItems] = useState<Array<ComboboxItem<unknown>>>([])
    return (
      <Stack align="flex-start" gap={2} className="shr-h-screen">
        {_cases.map((props, i) => (
          <MultiCombobox {...args} {...props} items={items} key={i} />
        ))}
        <MultiCombobox
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
} as Meta<typeof MultiCombobox>

export const VRT: StoryObj<typeof MultiCombobox> = {}

export const VRTForcedColors: StoryObj<typeof MultiCombobox> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
  },
}
