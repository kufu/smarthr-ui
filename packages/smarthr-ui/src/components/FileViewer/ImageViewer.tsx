'use client'

import { type FC, type SyntheticEvent, memo, useCallback, useMemo, useState } from 'react'

import { useLatest } from '../../hooks/useLatest'

import type { ViewerProps } from './types'

export const ImageViewer: FC<ViewerProps> = memo(
  ({ scale, rotation, file, width, handleLoad, handleLoadError }) => {
    const [viewConfig, setViewConfig] = useState(() => ({
      wrapperWidth: 0,
      wrapperHeight: 0,
      imgScale: 1,
      rotation: 0,
    }))

    const latest = useLatest({
      handleLoad,
      scale,
      rotation,
      width,
    })

    // CSSのみではscale, transformの値を親に適用してスクロールするようにできないため、計算している
    const functions = useMemo(() => {
      const updateViewConfig = (img: HTMLImageElement) => {
        if (!img.complete) {
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
        handleLoad: (e: SyntheticEvent<HTMLImageElement>) => {
          updateViewConfig(e.currentTarget)
          latest.handleLoad?.()
        },
      }
    }, [latest])

    const callbackRef = useCallback(
      (node: HTMLImageElement | null) => {
        if (node) {
          functions.updateViewConfig(node)
        }
      },
      // scale, rotation, widthの変化時にもcallbackRefを再実行し、updateViewConfigを再計算させるために必要
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [scale, rotation, width, functions],
    )

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
          ref={callbackRef}
          src={file.url}
          alt={file.alt}
          onLoad={functions.handleLoad}
          onError={handleLoadError}
          className="shr-absolute shr-left-[50%] shr-top-[50%] shr-origin-top-left -shr-translate-x-1/2 -shr-translate-y-1/2"
          style={{
            rotate: `${viewConfig.rotation}deg`,
            scale: `${viewConfig.imgScale}`,
          }}
        />
      </div>
    )
  },
)
