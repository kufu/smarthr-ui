'use client'

import Decimal from 'decimal.js'
import { type FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import {
  Button,
  Cluster,
  DropdownMenuButton,
  FaArrowRotateLeftIcon,
  FaMagnifyingGlassMinusIcon,
  FaMagnifyingGlassPlusIcon,
  Loader,
  Text,
  VisuallyHiddenText,
} from '../..'

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import type {
  OnDocumentLoadSuccess,
  OnPageLoadSuccess,
  Options,
} from 'react-pdf/dist/cjs/shared/types'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const defaultScaleStep = new Decimal(0.2)

const defaultScaleSteps = [0.2, 0.6, 1, 1.6, 2, 3]

const options = {
  // 非latin文字を読み込むためのオプション
  // 参考: https://github.com/wojtekmaj/react-pdf?tab=readme-ov-file#support-for-non-latin-characters
  cMapUrl: '/cmaps/',
} satisfies Options

type File = {
  url: string
  contentType: string
  alt?: string
}

type Props = {
  file: File
  width?: number

  /*
   * 拡大縮小率のステップを、100%を1とした配列で指定します。
   * */
  scaleSteps?: number[]

  scaleStep?: number
}

export const FileViewer: FC<Props> = ({
  scaleStep,
  scaleSteps,
  width: fixedWidth,
  file: { contentType, url, alt },
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [loaded, setLoaded] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [width, setWidth] = useState(fixedWidth ?? 0)

  const internalScaleStep = useMemo(
    () => (scaleStep ? new Decimal(scaleStep) : defaultScaleStep),
    [scaleStep],
  )

  const handleOnClickScaleUpButton = useCallback(() => {
    setScale((currentScale) => new Decimal(currentScale).add(internalScaleStep).toNumber())
  }, [internalScaleStep])

  const handleOnClickScaleDownButton = useCallback(() => {
    setScale((currentScale) => new Decimal(currentScale).sub(internalScaleStep).toNumber())
  }, [internalScaleStep])

  const handleOnClickRotateButton = useCallback(() => {
    setRotation((currentRotation) => currentRotation - 90)
  }, [])

  useEffect(() => {
    if (!ref.current) {
      return
    }
    if (typeof fixedWidth !== 'undefined') {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      if (!ref.current) {
        return
      }
      setWidth((ref.current?.clientWidth ?? 0) - 64)
    })

    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [fixedWidth])

  return (
    <div
      className="shr-flex shr-flex-col shr-w-full shr-gap-2 shr-bg-scrim shr-h-full shr-overflow-auto shr-bg-[radial-gradient(theme(textColor.black)_1px,_transparent_0)] shr-bg-[length:16px_16px]"
      ref={ref}
    >
      <div className="shr-flex-shrink-0 shr-flex shr-gap-0.5 shr-sticky shr-start-0 shr-top-0 shr-z-[1] shr-w-full">
        <Controller
          scale={scale}
          setScale={setScale}
          scaleSteps={scaleSteps || defaultScaleSteps}
          onClickScaleUpButton={handleOnClickScaleUpButton}
          onClickScaleDownButton={handleOnClickScaleDownButton}
          onClickRotateButton={handleOnClickRotateButton}
        />
      </div>
      <div className="shr-flex-shrink-0 shr-mx-auto shr-my-0 shr-w-fit shr-z-[0] shr-px-2 shr-pb-2 shr-items-center shr-justify-center shr-box-border shr-flex shr-grow">
        {!loaded && (
          <div className="shr-w-full shr-h-full shr-fixed shr-flex shr-items-center shr-justify-center shr-inset-0 shr-pointer-events-none">
            <Loader type="light" size="m" />
          </div>
        )}
        <div className={!loaded ? 'shr-invisible' : ''}>
          {(() => {
            if (contentType === 'application/pdf') {
              return (
                <PDFViewer
                  scale={scale}
                  rotation={rotation}
                  file={{ url, contentType }}
                  width={width}
                  onLoad={() => setLoaded(true)}
                />
              )
            }
            if (contentType.startsWith('image/')) {
              return (
                <ImageViewer
                  scale={scale}
                  rotation={rotation}
                  file={{ url, contentType, alt }}
                  width={width}
                  onLoad={() => setLoaded(true)}
                />
              )
            }
            return <Text>サポートされていない形式のファイルです。</Text>
          })()}
        </div>
      </div>
    </div>
  )
}

type ControllerProps = {
  scale: number
  setScale: (scale: number) => void
  scaleSteps: number[]
  onClickScaleUpButton: () => void
  onClickScaleDownButton: () => void
  onClickRotateButton: () => void
}

const Controller: FC<ControllerProps> = memo(
  ({
    scale,
    setScale,
    scaleSteps,
    onClickScaleUpButton,
    onClickScaleDownButton,
    onClickRotateButton,
  }) => (
    <div className="shr-flex shr-w-full shr-items-center shr-p-0.5 shr-gap-0.5 shr-sticky shr-justify-center shr-justify-items-center shr-bg-scrim shr-shadow-layer-1">
      <Cluster gap={0.5}>
        <div className="shr-flex shr-rounded-m shr-border-shorthand shr-overflow-hidden shr-divide-x shr-divide-solid">
          <Button
            onClick={onClickScaleDownButton}
            disabled={scale <= scaleSteps[0]}
            className="shr-border-none shr-rounded-none"
          >
            <FaMagnifyingGlassMinusIcon alt="縮小" />
          </Button>
          <DropdownMenuButton
            label={
              <Text>
                <VisuallyHiddenText>拡大率</VisuallyHiddenText>
                {`${(scale * 100).toFixed(0)}%`}
              </Text>
            }
            className="shr-border-[theme(borderColor.default)] shr-border-y-0 [&_.smarthr-ui-Button]:shr-rounded-none [&_.smarthr-ui-Button]:shr-border-[transparent]"
          >
            {scaleSteps.map((step) => (
              <Button
                key={step.toString()}
                onClick={() => setScale(step)}
                className="shr-border-0 shr-rounded-none"
              >
                {`${(step * 100).toFixed(0)}%`}
              </Button>
            ))}
          </DropdownMenuButton>
          <Button onClick={onClickScaleUpButton} className="shr-border-0 shr-rounded-none">
            <FaMagnifyingGlassPlusIcon alt="拡大" />
          </Button>
        </div>
        <Button onClick={onClickRotateButton} className="shr-p-0.75">
          <FaArrowRotateLeftIcon alt="左回転" />
        </Button>
      </Cluster>
    </div>
  ),
)

type ViewerProps = {
  file: File
  scale: number
  rotation: number
  width: number
  onLoad: () => void
}

const ImageViewer = memo(({ scale, rotation, file, width, onLoad }: ViewerProps) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const [viewConfig, setViewConfig] = useState({
    wrapperWidth: 0,
    wrapperHeight: 0,
    imgScale: 1,
  })

  // CSSのみではscale, transformの値を親に適用してスクロールするようにできないため、計算している
  const updateViewConfig = useCallback(() => {
    if (!imageRef.current) {
      return
    }

    const img = imageRef.current
    // 与えられたwidthに対する適切なscaleを算出
    const viewportScale = width / img.naturalWidth

    const rad = (rotation * Math.PI) / 180
    const sin = Math.abs(Math.sin(rad))
    const cos = Math.abs(Math.cos(rad))

    // imgをwidth: 100%で表示したときと同等の値を算出
    const scaledWidth = img.naturalWidth * scale * viewportScale
    const scaledHeight = img.naturalHeight * scale * viewportScale

    setViewConfig({
      wrapperWidth: scaledWidth * cos + scaledHeight * sin,
      wrapperHeight: scaledWidth * sin + scaledHeight * cos,
      imgScale: scale * viewportScale,
    })
  }, [scale, rotation, width])

  const handleLoad = useCallback(() => {
    updateViewConfig()
    onLoad?.()
  }, [updateViewConfig, onLoad])

  useEffect(() => {
    updateViewConfig()
  }, [updateViewConfig])

  return (
    <div
      style={{
        width: viewConfig.wrapperWidth,
        height: viewConfig.wrapperHeight,
      }}
      className="shr-relative shr-w-full shr-h-full"
    >
      {/* imgのload完了時にupdateViewConfigを呼び出さないと適切なサイズが取得できないため */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        className="shr-absolute shr-top-[50%] shr-left-[50%] -shr-translate-x-1/2 -shr-translate-y-1/2 shr-origin-top-left"
        ref={imageRef}
        src={file.url}
        alt={file.alt}
        style={{
          rotate: `${rotation}deg`,
          scale: `${viewConfig.imgScale}`,
        }}
        onLoad={handleLoad}
      />
    </div>
  )
})

const PDFViewer = memo(({ scale, rotation, file, width, onLoad }: ViewerProps) => {
  const [pdfNumPages, setPdfNumPages] = useState(1)

  const onDocumentLoadSuccess: OnDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPdfNumPages(numPages)
  }

  const onPageLoad: OnPageLoadSuccess = (page) => {
    // DocumentのLoadだとページごとの読み込みが考慮されないため
    if (page.pageNumber === pdfNumPages) {
      onLoad?.()
    }
  }

  return (
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
  )
})
