import React, { VFC, useEffect, useState } from 'react'
import { createGlobalStyle, css } from 'styled-components'

export const BodyScrollSuppressor: VFC = () => {
  const [originalWidth, setOriginalWidth] = useState<number | null>(null)
  const [paddingRightValue, setPaddingRightValue] = useState('0px')
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    setOriginalWidth(document.body.clientWidth)
  }, [])

  useEffect(() => {
    if (originalWidth === null) {
      return
    }
    setPaddingRightValue(getComputedStyle(document.body).getPropertyValue('padding-right'))
    const currentWidth = document.body.clientWidth
    const widthDiff = currentWidth - originalWidth
    if (widthDiff > 0) {
      setScrollbarWidth(widthDiff)
    }
  }, [originalWidth])

  if (originalWidth === null) {
    return null
  }
  return <ScrollSuppressing paddingRightValue={paddingRightValue} scrollbarWidth={scrollbarWidth} />
}

const ScrollSuppressing = createGlobalStyle<{
  paddingRightValue: string
  scrollbarWidth: number
}>`
  body {
    overflow: hidden;
    ${({ paddingRightValue, scrollbarWidth }) =>
      scrollbarWidth > 0 &&
      css`
        padding-right: calc(${paddingRightValue} + ${scrollbarWidth}px) !important;
      `}
  }
`
