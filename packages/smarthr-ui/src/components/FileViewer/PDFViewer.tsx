'use client'

import { type ComponentProps, type FC, memo, useCallback, useMemo, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import { ReactPDFStyle } from './generatedReactPDFStyle'

import type { ViewerProps } from './types'

// TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString()
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

const options = {
  // TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
  // 非latin文字を読み込むためのオプション
  // 参考: https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#support-for-non-latin-characters
  // cMapUrl: '/cmaps/',
  cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
} satisfies ComponentProps<typeof Document>['options']

export const PDFViewer: FC<ViewerProps> = memo(({ scale, rotation, file, width, onLoad }) => {
  const [pdfNumPages, setPdfNumPages] = useState(1)

  const onDocumentLoadSuccess = useCallback<
    NonNullable<ComponentProps<typeof Document>['onLoadSuccess']>
  >(({ numPages }) => {
    setPdfNumPages(numPages)
  }, [])

  const onPageLoad: ComponentProps<typeof Page>['onLoadSuccess'] = useMemo(() => {
    if (!onLoad) {
      return undefined
    }

    return (page) => {
      // DocumentのLoadだとページごとの読み込みが考慮されないため
      if (page.pageNumber !== pdfNumPages) {
        return
      }
      onLoad()
    }
  }, [pdfNumPages, onLoad])

  return (
    <>
      {/* TODO: 外部CSSをsmarthr-uiから読み込んでもらえるようにする機構ができたら消す */}
      <ReactPDFStyle />
      <Document
        options={options}
        file={file.url}
        onLoadSuccess={onDocumentLoadSuccess}
        rotate={rotation}
        className="shr-flex shr-h-full shr-w-fit shr-flex-col shr-items-center shr-gap-1 shr-overflow-auto"
        externalLinkTarget="_blank"
        loading={null}
      >
        {Array.from({ length: pdfNumPages }).map((_, i) => (
          <Page
            key={`page_${i}`}
            pageNumber={i + 1}
            width={width}
            scale={scale}
            className="shr-w-full"
            onLoadSuccess={onPageLoad}
            loading={null}
          />
        ))}
      </Document>
    </>
  )
})
