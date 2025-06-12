'use client'

import Decimal from 'decimal.js'
import { type FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

import { ImageViewer } from './ImageViewer'
import { PDFViewer } from './PDFViewer'

import type { FileForViewer } from './types'

const defaultScaleStep = new Decimal(0.2)

const defaultScaleSteps = [0.2, 0.6, 1, 1.6, 2, 3]

type Props = {
  file: FileForViewer
  width?: number

  /*
   * 拡大縮小率のステップを、100%を1とした配列で指定します。
   * */
  scaleSteps?: number[]

  scaleStep?: number
}

export const FileViewer: FC<Props> = ({ file, scaleStep, scaleSteps, width: fixedWidth }) => {
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
    if (!ref.current || fixedWidth !== undefined) {
      return
    }

    const resizeObserver = new ResizeObserver(() => {
      setWidth((ref.current?.clientWidth ?? 0) - 64)
    })

    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [fixedWidth])

  return (
    <div
      className="shr-flex shr-h-full shr-w-full shr-flex-col shr-gap-2 shr-overflow-auto shr-bg-scrim shr-bg-[radial-gradient(theme(textColor.black)_1px,_transparent_0)] shr-bg-[length:16px_16px]"
      ref={ref}
    >
      <div className="shr-sticky shr-start-0 shr-top-0 shr-z-[1] shr-flex shr-w-full shr-flex-shrink-0 shr-gap-0.5">
        <Controller
          scale={scale}
          setScale={setScale}
          scaleSteps={scaleSteps || defaultScaleSteps}
          onClickScaleUpButton={handleOnClickScaleUpButton}
          onClickScaleDownButton={handleOnClickScaleDownButton}
          onClickRotateButton={handleOnClickRotateButton}
        />
      </div>
      <div className="shr-z-[0] shr-mx-auto shr-my-0 shr-box-border shr-flex shr-w-fit shr-flex-shrink-0 shr-grow shr-items-center shr-justify-center shr-px-2 shr-pb-2">
        {!loaded && (
          <div className="shr-pointer-events-none shr-fixed shr-inset-0 shr-flex shr-h-full shr-w-full shr-items-center shr-justify-center">
            <Loader type="light" size="m" />
          </div>
        )}
        <div className={!loaded ? 'shr-invisible' : ''}>
          {file.contentType === 'application/pdf' ? (
            <PDFViewer
              scale={scale}
              rotation={rotation}
              file={file}
              width={width}
              onLoad={() => setLoaded(true)}
            />
          ) : file.contentType.startsWith('image/') ? (
            <ImageViewer
              scale={scale}
              rotation={rotation}
              file={file}
              width={width}
              onLoad={() => setLoaded(true)}
            />
          ) : (
            <Text>サポートされていない形式のファイルです。</Text>
          )}
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
    <div className="shr-sticky shr-flex shr-w-full shr-items-center shr-justify-center shr-justify-items-center shr-gap-0.5 shr-bg-scrim shr-p-0.5 shr-shadow-layer-1">
      <Cluster gap={0.5}>
        <div className="shr-border-shorthand shr-flex shr-divide-x shr-divide-solid shr-overflow-hidden shr-rounded-m">
          <Button
            onClick={onClickScaleDownButton}
            disabled={scale <= scaleSteps[0]}
            className="shr-rounded-none shr-border-none"
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
            className="shr-border-y-0 shr-border-[theme(borderColor.default)] [&_.smarthr-ui-Button]:shr-rounded-none [&_.smarthr-ui-Button]:shr-border-[transparent]"
          >
            {scaleSteps.map((step) => (
              <Button
                key={step.toString()}
                onClick={() => setScale(step)}
                className="shr-rounded-none shr-border-0"
              >
                {`${(step * 100).toFixed(0)}%`}
              </Button>
            ))}
          </DropdownMenuButton>
          <Button onClick={onClickScaleUpButton} className="shr-rounded-none shr-border-0">
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
