export const DEFAULT_COLOR = '#23221e'

export const EDITOR_COLORS = [
  { value: DEFAULT_COLOR, labelId: 'smarthr-ui/RichTextEditor/colorBlack', defaultText: '黒' },
  { value: '#e01e5a', labelId: 'smarthr-ui/RichTextEditor/colorRed', defaultText: '赤' },
  { value: '#0077c7', labelId: 'smarthr-ui/RichTextEditor/colorBlue', defaultText: '青' },
  { value: '#0f7f85', labelId: 'smarthr-ui/RichTextEditor/colorGreen', defaultText: '緑' },
  { value: '#f56121', labelId: 'smarthr-ui/RichTextEditor/colorOrange', defaultText: 'オレンジ' },
  { value: '#706d65', labelId: 'smarthr-ui/RichTextEditor/colorGrey', defaultText: 'グレー' },
] as const

export const isValidEditorColor = (color: string): boolean => /^#[0-9a-f]{3,6}$/i.test(color)
