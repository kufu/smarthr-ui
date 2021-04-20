import React, { VFC } from 'react'
import { createGlobalStyle, css } from 'styled-components'

export const BodyScrollSuppressor: VFC = () => {
  const [initialized, setInitialized] = React.useState(false)
  const [originalWidth, setOriginalWidth] = React.useState(0)
  const [widthDiff, setWidthDiff] = React.useState(0)

  React.useEffect(() => {
    setInitialized(true)
    return () => setInitialized(false)
  }, [])

  React.useEffect(() => {
    if (!initialized) {
      setOriginalWidth(document.body.clientWidth)
    }
  }, [initialized])

  React.useEffect(() => {
    if (!initialized) {
      return
    }
    const currentWidth = document.body.clientWidth
    const diff = currentWidth - originalWidth
    if (diff > 0) {
      setWidthDiff(diff)
    }
  }, [initialized, originalWidth])

  if (!initialized) {
    return null
  }
  return <ScrollSuppressing widthDiff={widthDiff} />
}

const ScrollSuppressing = createGlobalStyle<{ widthDiff: number }>`
  body {
    overflow: hidden;
    ${({ widthDiff }) =>
      widthDiff > 0 &&
      css`
        padding-right: ${widthDiff}px !important;
      `}
  }
`
