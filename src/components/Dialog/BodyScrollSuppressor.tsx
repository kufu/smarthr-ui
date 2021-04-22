import React, { VFC } from 'react'
import { createGlobalStyle, css } from 'styled-components'

export const BodyScrollSuppressor: VFC = () => {
  const [originalWidth, setOriginalWidth] = React.useState<number | null>(null)
  const [originalPaddingRight, setOriginalPaddingRight] = React.useState('0px')
  const [scrollbarWidth, setScrollbarWidth] = React.useState(0)

  React.useEffect(() => {
    setOriginalWidth(document.body.clientWidth)
    setOriginalPaddingRight(getComputedStyle(document.body).getPropertyValue('padding-right'))
  }, [])

  React.useEffect(() => {
    if (originalWidth === null) {
      return
    }
    const currentWidth = document.body.clientWidth
    const widthDiff = currentWidth - originalWidth
    if (widthDiff > 0) {
      setScrollbarWidth(widthDiff)
    }
  }, [originalWidth])

  if (originalWidth === null) {
    return null
  }
  return (
    <ScrollSuppressing
      originalPaddingRight={originalPaddingRight}
      scrollbarWidth={scrollbarWidth}
    />
  )
}

const ScrollSuppressing = createGlobalStyle<{
  originalPaddingRight: string
  scrollbarWidth: number
}>`
  body {
    overflow: hidden;
    ${({ originalPaddingRight, scrollbarWidth }) =>
      scrollbarWidth > 0 &&
      css`
        padding-right: calc(${originalPaddingRight} + ${scrollbarWidth}px) !important;
      `}
  }
`
