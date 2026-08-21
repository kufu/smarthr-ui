'use client'

import { type ComponentProps, type FC, memo, useCallback, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import { useLatest } from '../../hooks/useLatest'
import { Scroller } from '../Scroller'

import { SELECTED_MATCH_CLASS, matchSelector } from './buildCustomTextRenderer'
import { ReactPDFStyle } from './generatedReactPDFStyle'

import type { ViewerProps } from './types'
import type { UsePDFSearch } from './usePDFSearch'

if (typeof window !== 'undefined') {
  // iOS 17.3以下ではPromise.withResolversが未定義のため、polyfillを適用する
  // @ts-expect-error
  if (typeof window.Promise.withResolvers === 'undefined') {
    // @ts-expect-error
    window.Promise.withResolvers = function () {
      let resolve, reject
      const promise = new Promise((res, rej) => {
        resolve = res
        reject = rej
      })
      return { promise, resolve, reject }
    }
    // web workerもpolyfillされたものを読み込む
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`
  } else {
    // TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
    // pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    //   'pdfjs-dist/build/pdf.worker.min.mjs',
    //   import.meta.url,
    // ).toString()
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
  }
}

const options = {
  // TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
  // 非latin文字を読み込むためのオプション
  // 参考: https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#support-for-non-latin-characters
  // cMapUrl: '/cmaps/',
  cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
} satisfies ComponentProps<typeof Document>['options']

// pdfjs が用意している CSS 変数 (--highlight-bg-color / --highlight-selected-bg-color)を .textLayer スコープで上書きし、検索ハイライト色を変更している。
const HighlightOverrideStyle = () => (
  <style>{`
.textLayer {
  --highlight-bg-color: rgba(255, 235, 0, 0.5);
  --highlight-selected-bg-color: rgba(255, 140, 0, 0.6);
}
.textLayer mark.highlight {
  color: transparent;
}
`}</style>
)

type Props = ViewerProps & {
  search?: UsePDFSearch
}

export const PDFViewer: FC<Props> = memo(
  ({
    scale,
    rotation,
    file,
    width,
    handleLoad,
    handlePDFLoaded,
    handlePassword,
    handleLoadError,
    search,
  }) => {
    const matches = search?.matches
    const currentMatchIndex = search?.currentMatchIndex
    const [pdfNumPages, setPdfNumPages] = useState(1)

    const latest = useLatest({
      rotation,
      pdfNumPages,
      handleLoad,
      handlePDFLoaded,
    })

    const functions = useMemo(() => {
      const handleDocumentLoadSuccess: NonNullable<
        ComponentProps<typeof Document>['onLoadSuccess']
      > = ({ numPages }) => {
        setPdfNumPages(numPages)
      }
      const handlePageLoad: ComponentProps<typeof Page>['onLoadSuccess'] = (page) => {
        if (latest.rotation === undefined) {
          latest.handlePDFLoaded?.(page.rotate)
        }
        // DocumentのLoadだとページごとの読み込みが考慮されないため
        if (page.pageNumber === latest.pdfNumPages) {
          latest.handleLoad()
        }
      }

      return {
        handleDocumentLoadSuccess,
        handlePageLoad,
      }
    }, [latest])

    const cancelApplyIdRef = useRef<number | null>(null)
    const callbackRef = useCallback(
      (node: HTMLElement | null) => {
        if (node) {
          node
            .querySelectorAll(`mark.highlight.${SELECTED_MATCH_CLASS}`)
            .forEach((el) => el.classList.remove(SELECTED_MATCH_CLASS))

          if (currentMatchIndex === undefined || currentMatchIndex < 0) return

          const start = performance.now()
          const apply = () => {
            const els = node.querySelectorAll(matchSelector(currentMatchIndex))

            if (els.length > 0) {
              els.forEach((el) => el.classList.add(SELECTED_MATCH_CLASS))
              els[0].scrollIntoView({ block: 'center', behavior: 'smooth' })
            } else if (performance.now() - start < 1000) {
              cancelApplyIdRef.current = requestAnimationFrame(apply)
            }
          }
          cancelApplyIdRef.current = requestAnimationFrame(apply)
        } else if (cancelApplyIdRef.current !== null) {
          cancelAnimationFrame(cancelApplyIdRef.current)
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps -- matchesの変化でcallbackRefを再実行し、ハイライトを再適用させるために必要
      [currentMatchIndex, matches],
    )

    return (
      <>
        {/* TODO: 外部CSSをsmarthr-uiから読み込んでもらえるようにする機構ができたら消す */}
        <ReactPDFStyle />
        <HighlightOverrideStyle />
        <Scroller ref={callbackRef} direction="both" className="shr-h-full">
          <Document
            options={options}
            file={file.url}
            onLoadSuccess={functions.handleDocumentLoadSuccess}
            onLoadError={handleLoadError}
            rotate={rotation}
            className="shr-flex shr-w-fit shr-flex-col shr-items-center shr-gap-1"
            externalLinkTarget="_blank"
            loading={null}
            onPassword={handlePassword}
          >
            {Array.from({ length: pdfNumPages }).map((_, i) => (
              <Page
                key={`page_${i}`}
                pageNumber={i + 1}
                width={width}
                scale={scale}
                className="shr-w-full"
                onLoadSuccess={functions.handlePageLoad}
                onGetTextSuccess={search?.generateHandlePDFPageGetTextSuccess(i)}
                customTextRenderer={search?.customTextRenderer}
                loading={null}
              />
            ))}
          </Document>
        </Scroller>
      </>
    )
  },
)
