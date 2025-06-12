'use client'

import { type ComponentProps, type FC, memo, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import { ReactPDFStyle } from './generatedReactPDFStyle'

import type { ViewerProps } from './types'

// TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString()
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const options = {
  // TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
  // 非latin文字を読み込むためのオプション
  // 参考: https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#support-for-non-latin-characters
  // cMapUrl: '/cmaps/',
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
} satisfies ComponentProps<typeof Document>['options']

export const PDFViewer: FC<ViewerProps> = memo(({ scale, rotation, file, width, onLoad }) => {
  const [pdfNumPages, setPdfNumPages] = useState(1)

  const onDocumentLoadSuccess: ComponentProps<typeof Document>['onLoadSuccess'] = ({
    numPages,
  }: {
    numPages: number
  }) => {
    setPdfNumPages(numPages)
  }

  const onPageLoad: ComponentProps<typeof Page>['onLoadSuccess'] = (page) => {
    // DocumentのLoadだとページごとの読み込みが考慮されないため
    if (page.pageNumber === pdfNumPages) {
      onLoad?.()
    }
  }

  return (
    <>
      {/* TODO: 外部CSSをsmarthr-uiから読み込んでもらえるようにする機構ができたら消す */}
      <ReactPDFStyle />
      <Document
        options={options}
        file={file.url}
        onLoadSuccess={onDocumentLoadSuccess}
        rotate={rotation}
        className={`shr-h-full shr-flex shr-flex-col shr-gap-1 shr-items-center shr-w-fit shr-overflow-auto`}
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
