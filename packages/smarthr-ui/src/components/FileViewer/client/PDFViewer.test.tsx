import { render, waitFor } from '@testing-library/react'

// HINT: jsdom環境ではpdfjs-distでPDFを描画できないため、react-pdfをモックしてworkerの設定内容のみを検証する
vi.mock('react-pdf', () => ({
  Document: () => null,
  Page: () => null,
  pdfjs: {
    version: '0.0.0',
    GlobalWorkerOptions: { workerSrc: '' },
  },
}))

const FILE = { url: 'https://example.com/sample.pdf', contentType: 'application/pdf' }

const renderPDFViewer = async () => {
  // HINT: PDFViewerはreact-pdfの読み込み結果をモジュールスコープでキャッシュするため、テストごとにモジュールを読み込み直す
  vi.resetModules()

  const { PDFViewer } = await import('./PDFViewer')
  const { pdfjs } = await import('react-pdf')

  // HINT: モックしたreact-pdfはvi.resetModulesではリセットされないため、前のテストで設定されたworkerSrcを消しておく
  pdfjs.GlobalWorkerOptions.workerSrc = ''

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

  return { pdfjs }
}

describe('PDFViewer', () => {
  const originalURLParse = URL.parse
  const originalURLParseDescriptor = Object.getOwnPropertyDescriptor(URL, 'parse')

  afterEach(() => {
    if (originalURLParseDescriptor) {
      Object.defineProperty(URL, 'parse', originalURLParseDescriptor)
    } else {
      Reflect.deleteProperty(URL, 'parse')
    }
  })

  test('URL.parseが存在する環境では、通常ビルドのworkerを読み込む', async () => {
    const { pdfjs } = await renderPDFViewer()

    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBe(
      '//unpkg.com/pdfjs-dist@0.0.0/build/pdf.worker.min.mjs',
    )
    expect(URL.parse).toBe(originalURLParse)
  })

  test('URL.parseが存在しない環境では、polyfillを適用してlegacyビルドのworkerを読み込む', async () => {
    // HINT: テスト環境のURL.parseは継承元に定義されておりdeleteでは消せないため、undefinedで上書きして未定義の環境を再現する
    Object.defineProperty(URL, 'parse', { value: undefined, configurable: true, writable: true })

    const { pdfjs } = await renderPDFViewer()

    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBe(
      '//unpkg.com/pdfjs-dist@0.0.0/legacy/build/pdf.worker.min.mjs',
    )
    expect(URL.parse('https://example.com/sample.pdf')?.href).toBe('https://example.com/sample.pdf')
    expect(URL.parse('/sample.pdf', 'https://example.com/dir/')?.href).toBe(
      'https://example.com/sample.pdf',
    )
    expect(URL.parse('invalid url')).toBeNull()
  })
})
