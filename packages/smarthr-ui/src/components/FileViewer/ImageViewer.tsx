'use client'

import { type FC, memo, useCallback, useEffect, useRef, useState } from 'react'

import type { ViewerProps } from './types'

export const ImageViewer: FC<ViewerProps> = memo(
  ({ scale, rotation, file, width, onLoad, onLoadError }) => {
    const imageRef = useRef<HTMLImageElement>(null)
    const [viewConfig, setViewConfig] = useState({
      wrapperWidth: 0,
      wrapperHeight: 0,
      imgScale: 1,
    })

    // CSSのみではscale, transformの値を親に適用してスクロールするようにできないため、計算している
    const updateViewConfig = useCallback(() => {
      if (!imageRef.current?.complete) {
        return
      }

      const img = imageRef.current
      // 与えられたwidthに対する適切なscaleを算出
      const viewportScale = (width / img.naturalWidth) * scale

      const rad = (rotation * Math.PI) / 180
      const sin = Math.abs(Math.sin(rad))
      const cos = Math.abs(Math.cos(rad))

      // imgをwidth: 100%で表示したときと同等の値を算出
      const scaledWidth = img.naturalWidth * viewportScale
      const scaledHeight = img.naturalHeight * viewportScale

      setViewConfig({
        wrapperWidth: scaledWidth * cos + scaledHeight * sin,
        wrapperHeight: scaledWidth * sin + scaledHeight * cos,
        imgScale: viewportScale,
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
        className="shr-relative shr-h-full shr-w-full"
      >
        {/* imgのload完了時にupdateViewConfigを呼び出さないと適切なサイズが取得できないため */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <img
          className="shr-absolute shr-left-[50%] shr-top-[50%] shr-origin-top-left -shr-translate-x-1/2 -shr-translate-y-1/2"
          ref={imageRef}
          src={file.url}
          alt={file.alt}
          style={{
            rotate: `${rotation}deg`,
            scale: `${viewConfig.imgScale}`,
          }}
          onLoad={handleLoad}
          onError={onLoadError}
        />
      </div>
    )
  },
)
