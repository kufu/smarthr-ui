export const DEFAULT_BACKGROUND_COLOR = '#ffffff'

export const EDITOR_BACKGROUND_COLORS = [
  {
    value: '#f5f4f0',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorGrey',
    defaultText: 'グレー',
  },
  {
    value: '#eae3da',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorBrown',
    defaultText: '茶',
  },
  { value: '#fde2ea', labelId: 'smarthr-ui/RichTextEditor/backgroundColorRed', defaultText: '赤' },
  {
    value: '#fde6d3',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorOrange',
    defaultText: 'オレンジ',
  },
  {
    value: '#fbf3c4',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorYellow',
    defaultText: '黄',
  },
  {
    value: '#d9efdf',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorDarkGreen',
    defaultText: '深緑',
  },
  {
    value: '#d3eef0',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorGreen',
    defaultText: '緑',
  },
  {
    value: '#d2e9f5',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorLightBlue',
    defaultText: '水色',
  },
  { value: '#d2e5f5', labelId: 'smarthr-ui/RichTextEditor/backgroundColorBlue', defaultText: '青' },
  {
    value: '#e6dcf2',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorPurple',
    defaultText: '紫',
  },
  {
    value: '#f5d6e6',
    labelId: 'smarthr-ui/RichTextEditor/backgroundColorMagenta',
    defaultText: 'マゼンタ',
  },
] as const

export const isValidEditorBackgroundColor = (color: string): boolean =>
  /^#[0-9a-f]{3,6}$/i.test(color)
