import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from 'storybook/test'
import { backgroundColor } from '../../../../themes'

import { Stack, Cluster } from '../../../Layout'
import { SingleCombobox } from '../SingleCombobox'

import { defaultItems, prefixes } from './SingleCombobox.stories'

/* pict singleCombobox.pict
 * disabled        error   width   prefix  selectedItem
 * false   false   なし    なし    あり
 * false   true    あり    あり    なし
 * true    true    あり    なし    あり
 * true    false   あり    あり    なし
 * true    true    なし    なし    なし
 * true    false   なし    あり    あり
 */

const _cases: Array<Omit<Parameters<typeof SingleCombobox>[0], 'items'>> = [
  {
    disabled: false,
    readOnly: false,
    error: false,
    width: undefined,
    prefix: undefined,
    selectedItem: defaultItems['option 1'],
  },
  {
    disabled: false,
    readOnly: false,
    error: true,
    width: '15em',
    prefix: prefixes['あり'],
    selectedItem: null,
  },
  {
    disabled: true,
    readOnly: false,
    error: true,
    width: '15em',
    prefix: undefined,
    selectedItem:
      defaultItems[
        'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）'
      ],
  },
  {
    disabled: true,
    readOnly: false,
    error: false,
    width: '15em',
    prefix: prefixes['あり'],
    selectedItem: null,
  },
  {
    disabled: true,
    readOnly: false,
    error: true,
    width: undefined,
    prefix: undefined,
    selectedItem: null,
  },
  {
    disabled: true,
    readOnly: false,
    error: false,
    width: undefined,
    prefix: prefixes['あり'],
    selectedItem: defaultItems['アイテムのラベルがReactNodeの場合'],
  },
  {
    disabled: false,
    readOnly: true,
    error: true,
    width: '15em',
    prefix: undefined,
    selectedItem:
      defaultItems[
        'アイテムのラベルが長い場合（ダミーテキストダミーテキストダミーテキストダミーテキスト）'
      ],
  },
  {
    disabled: false,
    readOnly: true,
    error: false,
    width: '15em',
    prefix: prefixes['あり'],
    selectedItem: null,
  },
  {
    disabled: false,
    readOnly: true,
    error: true,
    width: undefined,
    prefix: undefined,
    selectedItem: null,
  },
  {
    disabled: false,
    readOnly: true,
    error: false,
    width: undefined,
    prefix: prefixes['あり'],
    selectedItem: defaultItems['アイテムのラベルがReactNodeの場合'],
  },
]

const playSingle = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement)
  const textboxes = await canvas.findAllByRole('combobox')

  await textboxes[textboxes.length - 1].click()

  const body = canvasElement.ownerDocument.body
  const option = await within(body).findByText('option 1')
  await userEvent.hover(option)
  const helpMessage = await within(body).findByText('入力でフィルタリングできます。')
  await userEvent.click(helpMessage) // カーソルの点滅によるVRTのフレーキーを避けるためにフォーカスを移動する
}

export default {
  title: 'Components/Combobox/SingleCombobox/VRT',
  component: SingleCombobox,
  render: (args) => (
    <Stack align="flex-start" gap={2} className="shr-h-screen">
      <Cluster>
        {_cases.map((props, i) => (
          <SingleCombobox {...args} {...props} items={Object.values(defaultItems)} key={i} />
        ))}
      </Cluster>
      <SingleCombobox
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
    chromatic: { disableSnapshot: false },
  },
  tags: ['!autodocs'],
} as Meta<typeof SingleCombobox>

export const VRT: StoryObj<typeof SingleCombobox> = {
  parameters: {
    backgrounds: { values: [{ name: 'light', value: backgroundColor.white }] },
  },
}

export const VRTForcedColors: StoryObj<typeof SingleCombobox> = {
  ...VRT,
  parameters: {
    chromatic: { forcedColors: 'active' },
    backgrounds: { values: [{ name: 'light', value: backgroundColor.white }] },
  },
}
