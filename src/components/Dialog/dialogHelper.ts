import { RefObject, useContext, useEffect, useRef, useState } from 'react'
import { PositionContext } from './DialogPositionProvider'
import { useTheme } from '../../hooks/useTheme'

type offsetHeightValues = {
  offsetHeight: number
  titleRef: RefObject<HTMLParagraphElement>
  bottomRef: RefObject<HTMLDivElement>
}

export const useOffsetHeight = (): offsetHeightValues => {
  const theme = useTheme()
  const baseSpace = theme.size.space.L
  const { top, bottom } = useContext(PositionContext)
  const titleRef = useRef<HTMLParagraphElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [offsetHeight, setOffsetHeight] = useState<number>(0)

  useEffect(() => {
    const topSpace = top ? top : baseSpace
    const bottomSpace = bottom ? bottom : baseSpace
    // delay scheduling to get the element's height
    setTimeout(() => {
      const titleHeight = titleRef.current ? titleRef.current.offsetHeight : 0
      const bottomHeight = bottomRef.current ? bottomRef.current.offsetHeight : 0
      setOffsetHeight(topSpace + bottomSpace + titleHeight + bottomHeight)
    }, 0)
  }, [top, bottom, baseSpace])

  return {
    offsetHeight,
    titleRef,
    bottomRef,
  }
}
