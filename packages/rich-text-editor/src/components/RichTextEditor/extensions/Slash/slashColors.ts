import { EDITOR_BACKGROUND_COLORS } from '../../Toolbar/ColorPicker/backgroundColors'
import { EDITOR_COLORS } from '../../Toolbar/ColorPicker/textColors'

import type { typedJa } from '../../../../intl'

type Label<K extends keyof typeof typedJa> = { id: K; defaultText: (typeof typedJa)[K] }

type SwatchLabelId =
  (typeof EDITOR_COLORS)[number]['labelId'] | (typeof EDITOR_BACKGROUND_COLORS)[number]['labelId']

const HUE_KEYWORDS = {
  grey: ['ぐれー', 'gray', 'grey'],
  red: ['あか', 'red'],
  orange: ['おれんじ', 'orange'],
  yellow: ['き', 'きいろ', 'yellow'],
  green: ['みどり', 'green'],
  lightBlue: ['みずいろ', 'light blue', 'cyan'],
  blue: ['あお', 'blue'],
  purple: ['むらさき', 'purple'],
} as const

const SWATCH_KEYWORDS: Record<SwatchLabelId, readonly string[]> = {
  'smarthr-ui/RichTextEditor/colorBlack': ['くろ', 'black'],
  'smarthr-ui/RichTextEditor/colorGrey': HUE_KEYWORDS.grey,
  'smarthr-ui/RichTextEditor/colorRed': HUE_KEYWORDS.red,
  'smarthr-ui/RichTextEditor/colorOrange': HUE_KEYWORDS.orange,
  'smarthr-ui/RichTextEditor/colorYellow': HUE_KEYWORDS.yellow,
  'smarthr-ui/RichTextEditor/colorGreen': HUE_KEYWORDS.green,
  'smarthr-ui/RichTextEditor/colorLightBlue': HUE_KEYWORDS.lightBlue,
  'smarthr-ui/RichTextEditor/colorBlue': HUE_KEYWORDS.blue,
  'smarthr-ui/RichTextEditor/colorPurple': HUE_KEYWORDS.purple,
  'smarthr-ui/RichTextEditor/backgroundColorGrey': HUE_KEYWORDS.grey,
  'smarthr-ui/RichTextEditor/backgroundColorRed': HUE_KEYWORDS.red,
  'smarthr-ui/RichTextEditor/backgroundColorOrange': HUE_KEYWORDS.orange,
  'smarthr-ui/RichTextEditor/backgroundColorYellow': HUE_KEYWORDS.yellow,
  'smarthr-ui/RichTextEditor/backgroundColorGreen': HUE_KEYWORDS.green,
  'smarthr-ui/RichTextEditor/backgroundColorLightBlue': HUE_KEYWORDS.lightBlue,
  'smarthr-ui/RichTextEditor/backgroundColorBlue': HUE_KEYWORDS.blue,
  'smarthr-ui/RichTextEditor/backgroundColorPurple': HUE_KEYWORDS.purple,
}

const RESET_KEYWORDS = ['reset', 'clear', 'none', 'りせっと', 'なし']

export type SlashColorOption = { keywords: readonly string[] } & (
  | { type: 'swatch'; label: Label<SwatchLabelId>; value: string }
  | {
      type: 'reset'
      label: Label<
        'smarthr-ui/RichTextEditor/colorReset' | 'smarthr-ui/RichTextEditor/backgroundColorReset'
      >
    }
)

export type SlashColorGroup = {
  attribute: 'color' | 'backgroundColor'
  label: Label<'smarthr-ui/RichTextEditor/color' | 'smarthr-ui/RichTextEditor/backgroundColor'>
  keywords: readonly string[]
  options: readonly SlashColorOption[]
}

const toSwatches = (
  entries: ReadonlyArray<{
    value: string
    labelId: SwatchLabelId
    defaultText: (typeof typedJa)[SwatchLabelId]
  }>,
): SlashColorOption[] =>
  entries.map(({ value, labelId, defaultText }) => ({
    type: 'swatch',
    label: { id: labelId, defaultText },
    keywords: SWATCH_KEYWORDS[labelId],
    value,
  }))

export const SLASH_COLOR_GROUPS: readonly SlashColorGroup[] = [
  {
    attribute: 'color',
    label: { id: 'smarthr-ui/RichTextEditor/color', defaultText: '文字色' },
    keywords: ['color', 'もじいろ', 'いろ'],
    options: [
      ...toSwatches(EDITOR_COLORS),
      {
        type: 'reset',
        label: { id: 'smarthr-ui/RichTextEditor/colorReset', defaultText: '文字色をリセット' },
        keywords: RESET_KEYWORDS,
      },
    ],
  },
  {
    attribute: 'backgroundColor',
    label: { id: 'smarthr-ui/RichTextEditor/backgroundColor', defaultText: '背景色' },
    keywords: ['background', 'highlight', 'はいけい', 'いろ'],
    options: [
      ...toSwatches(EDITOR_BACKGROUND_COLORS),
      {
        type: 'reset',
        label: {
          id: 'smarthr-ui/RichTextEditor/backgroundColorReset',
          defaultText: '背景色をリセット',
        },
        keywords: RESET_KEYWORDS,
      },
    ],
  },
]
