import { render, waitFor } from '@testing-library/react'

const FILE = { url: 'https://example.com/sample.pdf', contentType: 'application/pdf' }

const renderPDFViewer = async ({ useLegacyWorker }: { useLegacyWorker: boolean }) => {
  const calls: string[] = []
  const pdfjs = {
    version: '0.0.0',
    GlobalWorkerOptions: { workerSrc: '' },
  }

  // HINT: PDFViewerはreact-pdfの読み込み結果をモジュールスコープでキャッシュするため、テストごとにモジュールを読み込み直す
  vi.resetModules()
  vi.doMock('./applyPDFJSPolyfills', () => ({
    applyPDFJSPolyfills: () => {
      calls.push('applyPDFJSPolyfills')

      return useLegacyWorker
    },
  }))
  // HINT: jsdom環境ではpdfjs-distでPDFを描画できないため、react-pdfをモックしてworkerの設定内容のみを検証する
  vi.doMock('react-pdf', () => {
    calls.push('react-pdf')

    return { Document: () => null, Page: () => null, pdfjs }
  })

  const { PDFViewer } = await import('./PDFViewer')

  render(
    <PDFViewer
      file={FILE}
      scale={1}
      rotation={undefined}
      width={100}
      handleLoad={() => undefined}
    />,
  )

  await waitFor(() => expect(pdfjs.GlobalWorkerOptions.workerSrc).not.toBe(''))

  return { calls, pdfjs }
}

describe('PDFViewer', () => {
  afterEach(() => {
    vi.doUnmock('./applyPDFJSPolyfills')
    vi.doUnmock('react-pdf')
  })

  test('react-pdfを読み込む前にpolyfillを適用する', async () => {
    // HINT: pdfjs-distはモジュール評価時にもIteratorなどの新しいAPIを参照するため、読み込んだ後では間に合わない
    const { calls } = await renderPDFViewer({ useLegacyWorker: false })

    expect(calls).toEqual(['applyPDFJSPolyfills', 'react-pdf'])
  })

  test('polyfillが不要な環境では、通常ビルドのworkerを読み込む', async () => {
    const { pdfjs } = await renderPDFViewer({ useLegacyWorker: false })

    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBe(
      '//unpkg.com/pdfjs-dist@0.0.0/build/pdf.worker.min.mjs',
    )
  })

  test('polyfillが必要な環境では、legacyビルドのworkerを読み込む', async () => {
    const { pdfjs } = await renderPDFViewer({ useLegacyWorker: true })

    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBe(
      '//unpkg.com/pdfjs-dist@0.0.0/legacy/build/pdf.worker.min.mjs',
    )
  })

  test('react-pdfの読み込みを再試行する場合も、初回の判定でworkerを選ぶ', async () => {
    // HINT: 初回にpolyfillを適用すると、再試行時にはAPIが存在すると判定される
    const polyfillResults = [true, false]
    const pdfjs = {
      version: '0.0.0',
      GlobalWorkerOptions: { workerSrc: '' },
    }
    let importCount = 0

    vi.resetModules()
    vi.doMock('./applyPDFJSPolyfills', () => ({
      applyPDFJSPolyfills: () => polyfillResults.shift(),
    }))
    vi.doMock('react-pdf', () => {
      importCount++

      if (importCount === 1) {
        throw new Error('チャンクの取得に失敗')
      }

      return { Document: () => null, Page: () => null, pdfjs }
    })

    const { PDFViewer } = await import('./PDFViewer')
    const handleLoadError = vi.fn()
    const props = {
      file: FILE,
      scale: 1,
      rotation: undefined,
      width: 100,
      handleLoad: () => undefined,
      handleLoadError,
    }

    const { unmount } = render(<PDFViewer {...props} />)

    await waitFor(() => expect(handleLoadError).toHaveBeenCalled())
    unmount()

    render(<PDFViewer {...props} />)

    await waitFor(() => expect(pdfjs.GlobalWorkerOptions.workerSrc).not.toBe(''))
    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBe(
      '//unpkg.com/pdfjs-dist@0.0.0/legacy/build/pdf.worker.min.mjs',
    )
  })
})
