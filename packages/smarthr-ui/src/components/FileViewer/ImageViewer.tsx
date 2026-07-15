'use client'

import {
  type ComponentProps,
  type FC,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useLatest } from '../../hooks/useLatest'

import type { ViewerProps } from './types'

const ImageDisplay = memo<
  {
    wrapperWidth: number
    wrapperHeight: number
    rotation: number
    imgScale: number
    imageRef: RefObject<HTMLImageElement>
  } & Pick<ComponentProps<'img'>, 'src' | 'alt' | 'onLoad' | 'onError'>
>(({ wrapperWidth, wrapperHeight, rotation, imgScale, imageRef, ...rest }) => (
  <div
    style={{
      width: wrapperWidth,
      height: wrapperHeight,
    }}
    className="shr-relative shr-h-full shr-w-full"
  >
    {/* imgのload完了時にupdateViewConfigを呼び出さないと適切なサイズが取得できないため */}
    {/* eslint-disable-next-line smarthr/a11y-image-has-alt-attribute, jsx-a11y/alt-text */}
    <img
      {...rest}
      className="shr-absolute shr-left-[50%] shr-top-[50%] shr-origin-top-left -shr-translate-x-1/2 -shr-translate-y-1/2"
      ref={imageRef}
      style={{
        rotate: `${rotation}deg`,
        scale: `${imgScale}`,
      }}
    />
  </div>
))

export const ImageViewer: FC<ViewerProps> = memo(
  ({ scale, rotation, file, width, onLoad, onLoadError }) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const [viewConfig, setViewConfig] = useState({
      wrapperWidth: 0,
      wrapperHeight: 0,
      imgScale: 1,
      rotation: 0,
    })

    const latest = useLatest({
      onLoad,
      scale,
      rotation,
      width,
    })

    // CSSのみではscale, transformの値を親に適用してスクロールするようにできないため、計算している
    const functions = useMemo(() => {
      const updateViewConfig = () => {
        const img = imageRef.current

        if (!img?.complete) {
          return
        }

        // 与えられたwidthに対する適切なscaleを算出
        const viewportScale = (latest.width / img.naturalWidth) * latest.scale

        const rad = ((latest.rotation ?? 0) * Math.PI) / 180
        const sin = Math.abs(Math.sin(rad))
        const cos = Math.abs(Math.cos(rad))

        // imgをwidth: 100%で表示したときと同等の値を算出
        const scaledWidth = img.naturalWidth * viewportScale
        const scaledHeight = img.naturalHeight * viewportScale

        setViewConfig({
          wrapperWidth: scaledWidth * cos + scaledHeight * sin,
          wrapperHeight: scaledWidth * sin + scaledHeight * cos,
          imgScale: viewportScale,
          rotation: latest.rotation ?? 0,
        })
      }

      return {
        updateViewConfig,
        handleLoad: () => {
          updateViewConfig()
          latest.onLoad?.()
        },
      }
    }, [latest])

    useEffect(() => {
      functions.updateViewConfig()
    }, [scale, rotation, width, functions])

    return (
      <ImageDisplay
        {...viewConfig}
        src={file.url}
        alt={file.alt}
        onLoad={functions.handleLoad}
        onError={onLoadError}
        imageRef={imageRef}
      />
    )
  },
)
