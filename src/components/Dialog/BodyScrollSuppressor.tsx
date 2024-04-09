import React, { FC, useEffect, useState } from 'react'
import { createGlobalStyle, css } from 'styled-components'

export const BodyScrollSuppressor: FC = () => {
  const [scrollBarWidth, setScrollBarWidth] = useState<number | null>(null)
  const [paddingRight, setPaddingRight] = useState<number | null>(null)

  useEffect(() => {
    setScrollBarWidth(window.innerWidth - document.body.clientWidth)
  }, [])

  useEffect(() => {
    if (scrollBarWidth === null) {
      return
    }
    const originalPaddingRight = getComputedStyle(document.body).getPropertyValue('padding-right')
    setPaddingRight(scrollBarWidth + parseInt(originalPaddingRight, 10))
  }, [scrollBarWidth])

  if (scrollBarWidth === null) {
    return null
  }
  return <ScrollSuppressing paddingRight={paddingRight} />
}

const ScrollSuppressing = createGlobalStyle<{
  paddingRight: number | null
}>`
  body {
    overflow: hidden;
    ${({ paddingRight }) =>
      paddingRight &&
      css`
        padding-right: ${paddingRight}px !important;
      `}
  }
`
