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
import { tv } from 'tailwind-variants'

import { useEnvironment } from '../../hooks/useEnvironment'
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
  onPassword?: ComponentProps<typeof PDFViewer>['onPassword']
  onLoadError?: () => void
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

  const internalScaleStep = useMemo(
    () => (scaleStep ? new Decimal(scaleStep) : defaultScaleStep),
    [scaleStep],
  )

  const scaleUp = useCallback(() => {
    setScale((currentScale) => new Decimal(currentScale).add(internalScaleStep).toNumber())
  }, [internalScaleStep])

  const scaleDown = useCallback(() => {
    setScale((currentScale) => new Decimal(currentScale).sub(internalScaleStep).toNumber())
  }, [internalScaleStep])

  const rotate = useCallback(() => {
    // HINT: react-pdf側のAnnotationLayer.cssではマイナスの回転に対応しておらず、また0, 90, 180, 270度のみ対応しているため、-90度の場合は+270度として扱う
    const currentRotation = rotation ?? 0
    const newRotation = currentRotation === 0 ? 270 : currentRotation - 90
    setRotation(newRotation)
  }, [rotation])

  const handleLoaded = useCallback(() => {
    setLoaded(true)
  }, [])

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
          setScale={setScale}
          scaleSteps={scaleSteps || defaultScaleSteps}
          onClickScaleUpButton={scaleUp}
          onClickScaleDownButton={scaleDown}
          onClickRotateButton={rotate}
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
              onLoad={handleLoaded}
              onPDFLoaded={handlePDFLoaded}
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
              onLoad={handleLoaded}
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
  setScale: (scale: number) => void
  scaleSteps: number[]
  onClickScaleUpButton: () => void
  onClickScaleDownButton: () => void
  onClickRotateButton: () => void
  searchController?: ReactNode
}

const controllerClassNameGenerator = tv({
  base: 'shr-sticky shr-grid shr-w-full shr-items-center shr-bg-scrim shr-py-0.5 shr-shadow-layer-1',
  variants: {
    mobile: {
      true: 'shr-gap-0.5 shr-px-1',
      false: 'shr-grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] shr-gap-1.5 shr-px-2',
    },
  },
})

const Controller: FC<ControllerProps> = memo(
  ({
    scale,
    setScale,
    scaleSteps,
    onClickScaleUpButton,
    onClickScaleDownButton,
    onClickRotateButton,
    searchController,
  }) => {
    const { mobile } = useEnvironment()
    const className = useMemo(() => controllerClassNameGenerator({ mobile }), [mobile])

    const onClickScaleStep = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => setScale(Number(e.currentTarget.value)),
      [setScale],
    )

    return (
      <div className={className}>
        {/* PC 表示時のときに中央の操作ボタンたちを中央へ寄せるための空のスペーサー */}
        {!mobile && <div role="presentation" aria-hidden="true" />}
        <Cluster gap={0.5} className="shr-justify-self-center">
          <div className="shr-border-shorthand shr-flex shr-divide-x shr-divide-solid shr-overflow-hidden shr-rounded-m">
            <Button
              onClick={onClickScaleDownButton}
              disabled={scale <= scaleSteps[0]}
              className="shr-rounded-r-none shr-border-none"
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
              className="shr-border-y-0 shr-border-[theme(borderColor.default)] [&_.smarthr-ui-Button]:shr-rounded-none [&_.smarthr-ui-Button]:shr-border-[transparent]"
            >
              {scaleSteps.map((step) => (
                <Button
                  key={step.toString()}
                  value={step}
                  onClick={onClickScaleStep}
                  className="shr-rounded-none shr-border-0"
                >
                  {`${(step * 100).toFixed(0)}%`}
                </Button>
              ))}
            </DropdownMenuButton>
            <Button onClick={onClickScaleUpButton} className="shr-rounded-l-none shr-border-0">
              <FaMagnifyingGlassPlusIcon
                alt={<Localizer id="smarthr-ui/FileViewer/scaleUpAlt" defaultText="拡大" />}
              />
            </Button>
          </div>
          <Button onClick={onClickRotateButton} className="shr-p-0.75">
            <FaArrowRotateLeftIcon
              alt={<Localizer id="smarthr-ui/FileViewer/rotateAlt" defaultText="左回転" />}
            />
          </Button>
        </Cluster>
        {searchController ? (
          <div className="shr-min-w-0 shr-justify-self-stretch">{searchController}</div>
        ) : (
          /* PC 表示時のときに中央の操作ボタンたちを中央へ寄せるための空のスペーサー */
          !mobile && <div role="presentation" aria-hidden="true" />
        )}
      </div>
    )
  },
)
