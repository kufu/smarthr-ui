// バレル経由にするとEditorとToolbarが依存グラフに入り、表示専用の入口である意味が無くなる。
/* eslint-disable smarthr/require-barrel-import */
export { RichTextViewer } from './components/RichTextEditor/RichTextViewer/RichTextViewer'
export type {
  ExternalRichTextValue,
  RichTextJSON,
  RichTextViewerProps,
} from './components/RichTextEditor/types'
