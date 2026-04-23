import type { ComponentProps } from 'react'
import type { Document } from 'react-pdf'

export type FileForViewer = {
  url: string
  contentType: string
  alt?: string
}

export type ViewerProps = {
  file: FileForViewer
  scale: number
  rotation: number | undefined
  width: number
  onLoad: () => void
  onPDFLoaded?: (defaultRotation: number) => void
  /**
   * PDFファイルのパスワード入力を要求されたときに呼ばれるコールバック関数。PdfViewerでのみ使用されます。
   */
  onPassword?: ComponentProps<typeof Document>['onPassword']
  onLoadError?: () => void
}
