'use client'

import { type FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'
import { Scroller } from '../Scroller'

import { SELECTED_MATCH_CLASS, matchSelector } from './buildCustomTextRenderer'
import { ReactPDFStyle } from './generatedReactPDFStyle'

import type { ViewerProps } from './types'
import type { UsePDFSearch } from './usePDFSearch'
import type { Document, DocumentProps, Page, PageProps, pdfjs } from 'react-pdf'

// HINT: react-pdf(pdfjs-dist)はモジュール評価時にDOMMatrix等のブラウザAPIを参照するため、
// 静的importするとNext.jsのSSR(初回HTML生成)がReferenceErrorで失敗する。
// マウント後にのみ動的importすることでSSR時の評価を避ける。
type ReactPDFModule = {
  Document: typeof Document
  Page: typeof Page
  pdfjs: typeof pdfjs
}

let reactPDFModulePromise: Promise<ReactPDFModule> | undefined

const loadReactPDFModule = (): Promise<ReactPDFModule> => {
  if (!reactPDFModulePromise) {
    reactPDFModulePromise = import('react-pdf')
      .then((mod) => {
        const { pdfjs } = mod

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

        return mod
      })
      .catch((error) => {
        // HINT: 一時的なチャンク取得エラー等で拒否された場合、次回呼び出し時に再度importできるようキャッシュを解除する
        reactPDFModulePromise = undefined
        throw error
      })
  }

  return reactPDFModulePromise
}

// pdfjs が用意している CSS 変数 (--highlight-bg-color / --highlight-selected-bg-color)を .textLayer .highlight スコープで上書きし、検索ハイライト色を変更している。
// HINT: react-pdf 10.5.0 (pdfjs-dist 5.4.296) から、これらの変数の定義元が :root から .textLayer .highlight に変わったため、
// 同じセレクタで定義しないと詳細度で負けて上書きできない
const HighlightOverrideStyle = () => (
  <style>{`
.textLayer .highlight {
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
    const [reactPDFModule, setReactPDFModule] = useState<ReactPDFModule | null>(null)

    const latest = useLatest({
      rotation,
      pdfNumPages,
      handleLoad,
      handlePDFLoaded,
      handleLoadError,
    })

    useEffect(() => {
      let cancelled = false

      loadReactPDFModule().then(
        (mod) => {
          if (!cancelled) {
            setReactPDFModule(mod)
          }
        },
        (error) => {
          if (!cancelled) {
            latest.handleLoadError?.(error)
          }
        },
      )

      return () => {
        cancelled = true
      }
    }, [latest])

    const functions = useMemo(() => {
      const handleDocumentLoadSuccess: NonNullable<DocumentProps['onLoadSuccess']> = ({
        numPages,
      }) => {
        setPdfNumPages(numPages)
      }
      const handlePageLoad: PageProps['onLoadSuccess'] = (page) => {
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

    const options = useMemo(
      () =>
        ({
          // TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
          // 非latin文字を読み込むためのオプション
          // 参考: https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#support-for-non-latin-characters
          // cMapUrl: '/cmaps/',
          cMapUrl: `//unpkg.com/pdfjs-dist@${reactPDFModule?.pdfjs.version}/cmaps/`,
          // TODO: バンドラの関係でCDNから読み込んでいるが、smarthr-uiから配信するようにしたい
          // JPEG 2000画像を含むPDFのデコードに必要
          // 参考: https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#support-for-jpeg-2000
          // wasmUrl: '/wasm/',
          wasmUrl: `//unpkg.com/pdfjs-dist@${reactPDFModule?.pdfjs.version}/wasm/`,
        }) satisfies DocumentProps['options'],
      [reactPDFModule],
    )

    if (!reactPDFModule) {
      return null
    }

    const { Document, Page } = reactPDFModule

    return (
      <>
        {/* TODO: 外部CSSをsmarthr-uiから読み込んでもらえるようにする機構ができたら消す */}
        <ReactPDFStyle />
        <HighlightOverrideStyle />
        <Scroller ref={callbackRef} direction="both" className="shr-h-full">
          <Document
            file={file.url}
            rotate={rotation}
            externalLinkTarget="_blank"
            loading={null}
            className="shr-flex shr-w-fit shr-flex-col shr-items-center shr-gap-1"
            onLoadSuccess={functions.handleDocumentLoadSuccess}
            onLoadError={handleLoadError}
            onPassword={handlePassword}
            options={options}
          >
            {Array.from({ length: pdfNumPages }).map((_, i) => (
              <Page
                key={`page_${i}`}
                pageNumber={i + 1}
                scale={scale}
                customTextRenderer={search?.customTextRenderer}
                loading={null}
                width={width}
                className="shr-w-full"
                onLoadSuccess={functions.handlePageLoad}
                onGetTextSuccess={search?.generateHandlePDFPageGetTextSuccess(i)}
              />
            ))}
          </Document>
        </Scroller>
      </>
    )
  },
)
