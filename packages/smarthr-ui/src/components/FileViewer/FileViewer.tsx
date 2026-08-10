'use client'

import Decimal from 'decimal.js'
import {
  type ComponentProps,
  type FC,
  type MouseEvent,
  type ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from '../../hooks/useLatest'
import { Localizer } from '../../intl'
import { Button } from '../Button'
import { DropdownMenuButton } from '../Dropdown'
import {
  FaArrowRotateLeftIcon,
  FaMagnifyingGlassMinusIcon,
  FaMagnifyingGlassPlusIcon,
} from '../Icon'
import { Cluster } from '../Layout'
import { Loader } from '../Loader'
import { Scroller } from '../Scroller'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { ImageViewer } from './ImageViewer'
import { PDFViewer } from './PDFViewer'
import { SearchController } from './SearchController'
import { usePDFSearch } from './usePDFSearch'

import type { FileForViewer } from './types'

const defaultScaleStep = 0.2
const defaultScaleSteps = [0.2, 0.6, 1, 1.6, 2, 3]

type Props = {
  file: FileForViewer
  width?: number

  /*
   * 拡大縮小率のステップを、100%を1とした配列で指定します。
   * */
  scaleSteps?: number[]

  scaleStep?: number
  onPassword?: ComponentProps<typeof PDFViewer>['onPassword']
  onLoadError?: (error: unknown) => void
}

export const FileViewer: FC<Props> = ({
  file,
  scaleStep,
  scaleSteps,
  width: fixedWidth,
  onPassword,
  onLoadError,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [loaded, setLoaded] = useState(false)
  const [rotation, setRotation] = useState<number | undefined>(undefined)
  const [width, setWidth] = useState(fixedWidth ?? 0)
  const isPDF = file.contentType === 'application/pdf'

  const search = usePDFSearch(file.url)

  const latest = useLatest({ scaleStep, rotation })

  const functions = useMemo(() => {
    const calculateScale = (mode: 'add' | 'sub') => {
      // Decimal.jsのadd/subはnumberを直接受け取れるため、事前にDecimal化する必要はない
      setScale((currentScale) =>
        new Decimal(currentScale)[mode](latest.scaleStep ?? defaultScaleStep).toNumber(),
      )
    }

    return {
      scaleUp: () => calculateScale('add'),
      scaleDown: () => calculateScale('sub'),
      handleClickScaleStep: (e: MouseEvent<HTMLButtonElement>) =>
        setScale(Number(e.currentTarget.value)),
      rotate: () => {
        // HINT: react-pdf側のAnnotationLayer.cssではマイナスの回転に対応しておらず、また0, 90, 180, 270度のみ対応しているため、-90度の場合は+270度として扱う
        const currentRotation = latest.rotation ?? 0
        setRotation(currentRotation === 0 ? 270 : currentRotation - 90)
      },
      handleLoaded: () => {
        setLoaded(true)
      },
    }
  }, [latest])

  const handlePDFLoaded = useCallback((defaultRotation: number) => {
    setRotation(defaultRotation)
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
    <Scroller
      direction="both"
      className="shr-flex shr-h-full shr-w-full shr-flex-col shr-gap-2 shr-bg-scrim shr-bg-[radial-gradient(theme(textColor.black)_1px,_transparent_0)] shr-bg-[length:16px_16px]"
      ref={ref}
    >
      <div className="shr-sticky shr-start-0 shr-top-0 shr-z-[1] shr-flex shr-w-full shr-flex-shrink-0 shr-gap-0.5">
        <Controller
          scale={scale}
          scaleSteps={scaleSteps || defaultScaleSteps}
          functions={functions}
          searchController={isPDF ? <SearchController search={search} /> : undefined}
        />
      </div>
      <div className="shr-z-[0] shr-mx-auto shr-my-0 shr-box-border shr-flex shr-w-fit shr-flex-shrink-0 shr-grow shr-items-center shr-justify-center shr-px-2 shr-pb-2">
        {!loaded && (
          <div className="shr-pointer-events-none shr-fixed shr-inset-0 shr-flex shr-h-full shr-w-full shr-items-center shr-justify-center">
            <Loader type="light" size="M" />
          </div>
        )}
        <div className={!loaded ? 'shr-invisible' : ''}>
          {isPDF ? (
            <PDFViewer
              scale={scale}
              rotation={rotation}
              file={file}
              width={width}
              handleLoad={functions.handleLoaded}
              handlePDFLoaded={handlePDFLoaded}
              onPassword={onPassword}
              onLoadError={onLoadError}
              search={search}
            />
          ) : file.contentType.startsWith('image/') ? (
            <ImageViewer
              scale={scale}
              rotation={rotation}
              file={file}
              width={width}
              handleLoad={functions.handleLoaded}
              onLoadError={onLoadError}
            />
          ) : (
            <Localizer
              id="smarthr-ui/FileViewer/unsupportedFileText"
              defaultText="サポートされていない形式のファイルです。"
            />
          )}
        </div>
      </div>
    </Scroller>
  )
}

type ControllerProps = {
  scale: number
  scaleSteps: number[]
  functions: {
    scaleUp: () => void
    scaleDown: () => void
    handleClickScaleStep: (e: MouseEvent<HTMLButtonElement>) => void
    rotate: () => void
  }
  searchController?: ReactNode
}

const Controller: FC<ControllerProps> = memo(
  ({ scale, scaleSteps, functions, searchController }) => (
    <Cluster
      gap={0}
      align="end"
      className="shr-sticky shr-box-border shr-w-full shr-justify-center shr-bg-scrim shr-px-0.5 shr-shadow-layer-1"
    >
      {/* 操作ボタンを中央へ寄せるための空のスペーサー */}
      <div
        role="presentation"
        aria-hidden="true"
        className="shr-grow shr-basis-[calc((45em_-_100%)*999)]"
      />
      <Cluster
        gap={0.5}
        className="shr-grow shr-basis-[calc((45em_-_100%)*999)] shr-items-center shr-justify-center shr-justify-self-center shr-py-0.5"
      >
        <Cluster gap={0}>
          <Button
            onClick={functions.scaleDown}
            disabled={scale <= scaleSteps[0]}
            className="shr-rounded-r-none"
          >
            <FaMagnifyingGlassMinusIcon
              alt={<Localizer id="smarthr-ui/FileViewer/scaleDownAlt" defaultText="縮小" />}
            />
          </Button>
          <DropdownMenuButton
            trigger={
              <>
                <VisuallyHiddenText>
                  <Localizer id="smarthr-ui/FileViewer/scaleRateLabel" defaultText="拡大率" />
                </VisuallyHiddenText>
                {`${(scale * 100).toFixed(0)}%`}
              </>
            }
            className="[&_.smarthr-ui-Button]:shr-rounded-none [&_.smarthr-ui-Button]:shr-border-x-[0]"
          >
            {scaleSteps.map((step) => (
              <Button key={step.toString()} value={step} onClick={functions.handleClickScaleStep}>
                {`${(step * 100).toFixed(0)}%`}
              </Button>
            ))}
          </DropdownMenuButton>
          <Button onClick={functions.scaleUp} className="shr-rounded-l-none">
            <FaMagnifyingGlassPlusIcon
              alt={<Localizer id="smarthr-ui/FileViewer/scaleUpAlt" defaultText="拡大" />}
            />
          </Button>
        </Cluster>
        <Button onClick={functions.rotate} className="shr-p-0.75">
          <FaArrowRotateLeftIcon
            alt={<Localizer id="smarthr-ui/FileViewer/rotateAlt" defaultText="左回転" />}
          />
        </Button>
      </Cluster>
      {searchController ? (
        <div className="shr-min-w-0 shr-grow shr-basis-[calc((45em_-_100%)*999)] shr-justify-self-stretch shr-px-0.5 shr-pb-0.5">
          {searchController}
        </div>
      ) : (
        // 操作ボタンを中央へ寄せるための空のスペーサー
        <div
          role="presentation"
          aria-hidden="true"
          className="shr-grow shr-basis-[calc((45em_-_100%)*999)]"
        />
      )}
    </Cluster>
  ),
)
