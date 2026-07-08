'use client'

import { type FC, type RefObject, memo, useCallback, useEffect, useRef, useState } from 'react'

import type { ViewerProps } from './types'

const ImageDisplay = memo<{
  wrapperWidth: number
  wrapperHeight: number
  rotation: number
  imgScale: number
  url: string
  alt?: string
  onLoad: () => void
  onLoadError?: () => void
  imageRef: RefObject<HTMLImageElement>
}>(
  ({
    wrapperWidth,
    wrapperHeight,
    rotation,
    imgScale,
    url,
    alt,
    onLoad,
    onLoadError,
    imageRef,
  }) => (
    <div
      style={{
        width: wrapperWidth,
        height: wrapperHeight,
      }}
      className="shr-relative shr-h-full shr-w-full"
    >
      {/* imgのload完了時にupdateViewConfigを呼び出さないと適切なサイズが取得できないため */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <img
        className="shr-absolute shr-left-[50%] shr-top-[50%] shr-origin-top-left -shr-translate-x-1/2 -shr-translate-y-1/2"
        ref={imageRef}
        src={url}
        alt={alt}
        style={{
          rotate: `${rotation}deg`,
          scale: `${imgScale}`,
        }}
        onLoad={onLoad}
        onError={onLoadError}
      />
    </div>
  ),
)

export const ImageViewer: FC<ViewerProps> = memo(
  ({ scale, rotation, file, width, onLoad, onLoadError }) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const [viewConfig, setViewConfig] = useState({
      wrapperWidth: 0,
      wrapperHeight: 0,
      imgScale: 1,
      rotation: 0,
    })

    // CSSのみではscale, transformの値を親に適用してスクロールするようにできないため、計算している
    const updateViewConfig = useCallback(() => {
      if (!imageRef.current?.complete) {
        return
      }

      const img = imageRef.current
      // 与えられたwidthに対する適切なscaleを算出
      const viewportScale = (width / img.naturalWidth) * scale

      const rad = ((rotation ?? 0) * Math.PI) / 180
      const sin = Math.abs(Math.sin(rad))
      const cos = Math.abs(Math.cos(rad))

      // imgをwidth: 100%で表示したときと同等の値を算出
      const scaledWidth = img.naturalWidth * viewportScale
      const scaledHeight = img.naturalHeight * viewportScale

      setViewConfig({
        wrapperWidth: scaledWidth * cos + scaledHeight * sin,
        wrapperHeight: scaledWidth * sin + scaledHeight * cos,
        imgScale: viewportScale,
        rotation: rotation ?? 0,
      })
    }, [scale, rotation, width])

    const unstableRef = useRef({
      onLoad,
      updateViewConfig,
    })
    unstableRef.current = {
      onLoad,
      updateViewConfig,
    }

    const handleLoad = useCallback(() => {
      unstableRef.current.updateViewConfig()
      unstableRef.current.onLoad?.()
    }, [])

    useEffect(() => {
      unstableRef.current.updateViewConfig()
    }, [scale, rotation, width])

    return (
      <ImageDisplay
        {...viewConfig}
        url={file.url}
        alt={file.alt}
        onLoad={handleLoad}
        onLoadError={onLoadError}
        imageRef={imageRef}
      />
    )
  },
)
