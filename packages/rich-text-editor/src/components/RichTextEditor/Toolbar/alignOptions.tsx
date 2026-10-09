import {
  FaAlignCenterIcon,
  FaAlignJustifyIcon,
  FaAlignLeftIcon,
  FaAlignRightIcon,
} from 'smarthr-ui'

// shortcut は @tiptap/extension-text-align の既定バインドと対応する。
// Tiptap は拡張のキーバインドを外部へ公開していないため二重管理になる。
export const ALIGN_OPTIONS = [
  {
    value: 'left',
    labelId: 'smarthr-ui/RichTextEditor/alignLeft',
    defaultText: '左揃え',
    shortcut: 'Mod-Shift-L',
  },
  {
    value: 'center',
    labelId: 'smarthr-ui/RichTextEditor/alignCenter',
    defaultText: '中央揃え',
    shortcut: 'Mod-Shift-E',
  },
  {
    value: 'right',
    labelId: 'smarthr-ui/RichTextEditor/alignRight',
    defaultText: '右揃え',
    shortcut: 'Mod-Shift-R',
  },
  {
    value: 'justify',
    labelId: 'smarthr-ui/RichTextEditor/alignJustify',
    defaultText: '両端揃え',
    shortcut: 'Mod-Shift-J',
  },
] as const

export const getAlignIcon = (value: string) => {
  switch (value) {
    case 'center':
      return <FaAlignCenterIcon />
    case 'right':
      return <FaAlignRightIcon />
    case 'justify':
      return <FaAlignJustifyIcon />
    default:
      return <FaAlignLeftIcon />
  }
}
