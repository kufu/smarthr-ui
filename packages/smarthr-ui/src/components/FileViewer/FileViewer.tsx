import Decimal from 'decimal.js'
import { type FC, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

import {
  Button,
  FaArrowRotateRightIcon,
  FaMagnifyingGlassMinusIcon,
  FaMagnifyingGlassPlusIcon,
} from '../..'

import 'react-pdf/dist/Page/TextLayer.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`

const SCALE_STEP = new Decimal(0.4)
const MIN_SCALE = 0.2

type RotationType = 0 | 90 | 180 | 270
const getRotatedAngle = ({ base }: { base: RotationType }): RotationType => {
  switch (base) {
    case 0:
      return 90
    case 90:
      return 180
    case 180:
      return 270
    case 270:
      return 0
  }
}

const options = {
  /**
   * non-latin な文字を表示するためのリソースを読み込む
   */
  cMapUrl: '/cmaps/',
}

type Props = {
  url: string
  contentType: string
  filename: string
  width: number
}

export function useDocumentViewer({ url, contentType, filename, width }: Props) {
  const [pdfNumPages, setPdfNumPages] = useState(1)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState<RotationType>(0)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPdfNumPages(numPages)
  }

  const handleOnClickScaleUpButton = () => {
    const statedScale = new Decimal(scale)
    setScale(statedScale.add(SCALE_STEP).toNumber())
  }

  const handleOnClickScaleDownButton = () => {
    const statedScale = new Decimal(scale)
    setScale(statedScale.sub(SCALE_STEP).toNumber())
  }

  const handleOnClickRotateButton = () => {
    setRotate(getRotatedAngle({ base: rotate }))
  }

  const viewer =
    contentType === 'application/pdf' ? (
      <Document
        options={options}
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        rotate={rotate}
        className="shr-h-full shr-flex shr-flex-col shr-gap-1 shr-items-center shr-w-fit"
      >
        {Array.from({ length: pdfNumPages }).map((_, i) => (
          <Page
            key={`page_${i + 1}`}
            pageNumber={i + 1}
            width={width}
            scale={scale}
            className="shr-w-fit"
          />
        ))}
      </Document>
    ) : (
      <div className="shr-origin-top-left" style={{ scale: `${scale}` }}>
        <img
          src={url}
          alt={filename}
          style={{ rotate: `${rotate}deg` }}
          width={width}
          className="markuplint-ignore-required-attr-height"
        />
      </div>
    )

  const controller = (
    <div className="shr-flex shr-w-full shr-items-center shr-p-0.5 shr-gap-0.5 shr-sticky shr-justify-center shr-bg-scrim shr-shadow-layer-1">
      <Button onClick={handleOnClickRotateButton} className="shr-p-0.75">
        <FaArrowRotateRightIcon alt="右回転" />
      </Button>
      <Button onClick={handleOnClickScaleUpButton} className="shr-p-0.75">
        <FaMagnifyingGlassPlusIcon alt="拡大" />
      </Button>
      <Button
        onClick={handleOnClickScaleDownButton}
        className="shr-p-0.75"
        disabled={scale <= MIN_SCALE}
      >
        <FaMagnifyingGlassMinusIcon alt="縮小" />
      </Button>
    </div>
  )

  return { viewer, controller }
}

export const FileViewer: FC<Props> = ({ width, filename, contentType, url }) => {
  const ref = useRef<HTMLDivElement>(null)
  // useLayoutEffect(() => {
  //   if (!ref.current) {
  //     return
  //   }
  //   ref.current.scrollLeft += 1000
  //   console.log(ref.current.scrollLeft)
  // }, [])

  const [pdfNumPages, setPdfNumPages] = useState(1)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState<RotationType>(0)

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPdfNumPages(numPages)

    if (!ref.current) {
      return
    }
    ref.current.scrollLeft += 10000
  }

  const handleOnClickScaleUpButton = () => {
    const statedScale = new Decimal(scale)
    setScale(statedScale.add(SCALE_STEP).toNumber())
  }

  const handleOnClickScaleDownButton = () => {
    const statedScale = new Decimal(scale)
    setScale(statedScale.sub(SCALE_STEP).toNumber())
  }

  const handleOnClickRotateButton = () => {
    setRotate(getRotatedAngle({ base: rotate }))
  }

  const Viewer = () => {
    if (contentType === 'application/pdf') {
      return (
        <Document
          options={options}
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          rotate={rotate}
          className="shr-h-full shr-flex shr-flex-col shr-gap-1 shr-items-center shr-w-fit"
        >
          {Array.from({ length: pdfNumPages }).map((_, i) => (
            <Page
              key={`page_${i + 1}`}
              pageNumber={i + 1}
              width={width}
              scale={scale}
              className="shr-w-fit"
            />
          ))}
        </Document>
      )
    }
    return (
      <div className="shr-origin-top-left" style={{ scale: `${scale}` }}>
        <img
          src={url}
          alt={filename}
          style={{ rotate: `${rotate}deg` }}
          width={width}
          className="markuplint-ignore-required-attr-height"
        />
      </div>
    )
  }

  const Controller = () => (
    <div className="shr-flex shr-w-full shr-items-center shr-p-0.5 shr-gap-0.5 shr-sticky shr-justify-center shr-bg-scrim shr-shadow-layer-1">
      <Button onClick={handleOnClickRotateButton} className="shr-p-0.75">
        <FaArrowRotateRightIcon alt="右回転" />
      </Button>
      <Button onClick={handleOnClickScaleUpButton} className="shr-p-0.75">
        <FaMagnifyingGlassPlusIcon alt="拡大" />
      </Button>
      <Button
        onClick={handleOnClickScaleDownButton}
        className="shr-p-0.75"
        disabled={scale <= MIN_SCALE}
      >
        <FaMagnifyingGlassMinusIcon alt="縮小" />
      </Button>
    </div>
  )
  return (
    <div
      className="shr-flex shr-flex-col shr-w-full shr-gap-1 shr-bg-scrim shr-h-full shr-overflow-auto shr-bg-[radial-gradient(theme(textColor.black)_1px,_transparent_0)] shr-bg-[length:16px_16px]"
      ref={ref}
    >
      <div className="shr-flex-shrink-0 shr-flex shr-gap-0.5 shr-sticky shr-start-0 shr-top-0 shr-z-[1] shr-w-full">
        <Controller />
      </div>
      <div className="shr-flex-shrink-0 shr-mx-auto shr-my-0 shr-w-fit shr-z-[0] shr-px-[50%]">
        <Viewer />
      </div>
    </div>
  )
}
