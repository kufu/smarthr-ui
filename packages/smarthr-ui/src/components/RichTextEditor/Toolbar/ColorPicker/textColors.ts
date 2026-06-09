export const DEFAULT_COLOR = '#23221e'

export const EDITOR_COLORS = [
  { value: DEFAULT_COLOR, labelId: 'smarthr-ui/RichTextEditor/colorBlack', defaultText: '黒' },
  { value: '#706d65', labelId: 'smarthr-ui/RichTextEditor/colorGrey', defaultText: 'グレー' },
  { value: '#8a5a3b', labelId: 'smarthr-ui/RichTextEditor/colorBrown', defaultText: '茶' },
  { value: '#e01e5a', labelId: 'smarthr-ui/RichTextEditor/colorRed', defaultText: '赤' },
  { value: '#c8541a', labelId: 'smarthr-ui/RichTextEditor/colorOrange', defaultText: 'オレンジ' },
  { value: '#8a6d00', labelId: 'smarthr-ui/RichTextEditor/colorYellow', defaultText: '黄' },
  { value: '#1f7a3a', labelId: 'smarthr-ui/RichTextEditor/colorDarkGreen', defaultText: '深緑' },
  { value: '#0f7f85', labelId: 'smarthr-ui/RichTextEditor/colorGreen', defaultText: '緑' },
  { value: '#0a6db3', labelId: 'smarthr-ui/RichTextEditor/colorLightBlue', defaultText: '水色' },
  { value: '#0077c7', labelId: 'smarthr-ui/RichTextEditor/colorBlue', defaultText: '青' },
  { value: '#7239b3', labelId: 'smarthr-ui/RichTextEditor/colorPurple', defaultText: '紫' },
  { value: '#b3267a', labelId: 'smarthr-ui/RichTextEditor/colorMagenta', defaultText: 'マゼンタ' },
] as const

export const isValidEditorColor = (color: string): boolean => /^#[0-9a-f]{3,6}$/i.test(color)
