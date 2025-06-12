'use client'

import { type FC, memo, useCallback, useEffect, useRef, useState } from 'react'

import type { ViewerProps } from './types'

export const ImageViewer: FC<ViewerProps> = memo(({ scale, rotation, file, width, onLoad }) => {
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
