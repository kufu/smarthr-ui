'use client'

import {
  type ComponentProps,
  type FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import { Scroller } from '../Scroller'

import { buildCustomTextRenderer } from './buildCustomTextRenderer'
import { ReactPDFStyle } from './generatedReactPDFStyle'

import type { ViewerProps } from './types'

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

type CustomTextRenderer = NonNullable<ComponentProps<typeof Page>['customTextRenderer']>
type TextContent = Parameters<NonNullable<ComponentProps<typeof Page>['onGetTextSuccess']>>[number]

// pdfjs が用意している CSS 変数 (--highlight-bg-color / --highlight-selected-bg-color)
// を .textLayer スコープで上書きし、検索ハイライト色を変更している。
// 通常ヒットは薄い黄色、現在ヒット (selected) はオレンジで色分けする。
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

export const PDFViewer: FC<ViewerProps> = memo(
  ({
    scale,
    rotation,
    file,
    width,
    onLoad,
    onPDFLoaded,
    onPassword,
    onLoadError,
    searchQuery,
    matches,
    currentMatchIndex,
    onPageTextLoaded,
  }) => {
    const [pdfNumPages, setPdfNumPages] = useState(1)
    const rootRef = useRef<HTMLDivElement>(null)

    const onDocumentLoadSuccess = useCallback<
      NonNullable<ComponentProps<typeof Document>['onLoadSuccess']>
    >(({ numPages }) => {
      setPdfNumPages(numPages)
    }, [])

    const onPageLoad: ComponentProps<typeof Page>['onLoadSuccess'] = useMemo(() => {
      if (!onLoad && !onPDFLoaded) {
        return undefined
      }

      return (page) => {
        if (onPDFLoaded && rotation === undefined) {
          onPDFLoaded(page.rotate)
        }
        // DocumentのLoadだとページごとの読み込みが考慮されないため
        if (onLoad && page.pageNumber === pdfNumPages) {
          onLoad()
        }
      }
    }, [onLoad, onPDFLoaded, pdfNumPages, rotation])

    const customTextRenderer = useMemo<CustomTextRenderer | undefined>(() => {
      if (!searchQuery || !matches || matches.length === 0) {
        return undefined
      }
      return buildCustomTextRenderer(matches, currentMatchIndex)
    }, [searchQuery, matches, currentMatchIndex])

    const handleGetTextSuccess = useCallback(
      (pageIndex: number, textContent: TextContent) => {
        if (!onPageTextLoaded) return
        const texts: string[] = textContent.items
          .filter((item) => 'str' in item)
          .map((item) => item.str)
        onPageTextLoaded(pageIndex, texts)
      },
      [onPageTextLoaded],
    )

    // 現在のヒットへ自動スクロール。
    // pdf.js の textLayer 描画は非同期なので、対象 mark が DOM に出現するまでrequestAnimationFrame で最大 1 秒リトライする。
    useEffect(() => {
      if (currentMatchIndex === undefined || currentMatchIndex < 0) return
      const start = performance.now()
      let id = 0
      const tryScroll = () => {
        const el = rootRef.current?.querySelector(
          `mark.highlight.selected[data-shr-match-index="${currentMatchIndex}"]`,
        )
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' })
          return
        }
        if (performance.now() - start < 1000) {
          id = requestAnimationFrame(tryScroll)
        }
      }
      id = requestAnimationFrame(tryScroll)
      return () => cancelAnimationFrame(id)
    }, [currentMatchIndex, matches])

    return (
      <>
        {/* TODO: 外部CSSをsmarthr-uiから読み込んでもらえるようにする機構ができたら消す */}
        <ReactPDFStyle />
        <HighlightOverrideStyle />
        <Scroller ref={rootRef} direction="both" className="shr-h-full">
          <Document
            options={options}
            file={file.url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onLoadError}
            rotate={rotation}
            className="shr-flex shr-w-fit shr-flex-col shr-items-center shr-gap-1"
            externalLinkTarget="_blank"
            loading={null}
            onPassword={onPassword}
          >
            {Array.from({ length: pdfNumPages }).map((_, i) => (
              <Page
                key={`page_${i}`}
                pageNumber={i + 1}
                width={width}
                scale={scale}
                className="shr-w-full"
                onLoadSuccess={onPageLoad}
                onGetTextSuccess={(textContent) => handleGetTextSuccess(i, textContent)}
                customTextRenderer={customTextRenderer}
                loading={null}
              />
            ))}
          </Document>
        </Scroller>
      </>
    )
  },
)
