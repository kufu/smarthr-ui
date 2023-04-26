import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

export type Props = {
  /** Tableを囲うDivのClassName指定 */
  wrapperClassName?: string
  /** TableのClassName指定 */
  children: React.ReactNode
}
type TableElementProps = Omit<HTMLAttributes<HTMLTableElement>, keyof Props>

export const TableReel: React.FC<Props & TableElementProps> = ({
  wrapperClassName = '',
  children,
  ...props
}) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)
  const [showShadow, setShowShadow] = useState(false)

  useEffect(() => {
    const currentRef = tableWrapperRef.current

    const handleScroll = () => {
      if (currentRef) {
        const stickyCells = currentRef.querySelectorAll('.fixedElement') || []
        const scrollLeft = currentRef.scrollLeft
        const maxScrollLeft = currentRef.scrollWidth - currentRef.clientWidth || 0

        stickyCells.forEach((cell) => {
          const shouldFix = maxScrollLeft > 0 && scrollLeft < maxScrollLeft

          if (shouldFix) {
            cell.classList.add('fixed')
            setShowShadow(scrollLeft > 0)
          } else {
            cell.classList.remove('fixed')
            setShowShadow(true)
          }
        })
      }
    }

    handleScroll()

    window.addEventListener('resize', handleScroll)
    currentRef?.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleScroll)
      currentRef?.removeEventListener('scroll', handleScroll)
    }
  }, [tableWrapperRef])

  return (
    <Shadow showShadow={showShadow}>
      <Wrapper {...props} ref={tableWrapperRef}>
        {children}
      </Wrapper>
    </Shadow>
  )
}

const Shadow = styled.div<{ showShadow: boolean }>`
  ${({ showShadow }) => css`
    position: relative;

    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      left: 0;
      top: 0;
      width: 12px;
      pointer-events: none; /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
      height: 100%;
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
      opacity: ${showShadow ? 1 : 0};
      transition: opacity 0.2s;
    }
  `}
`

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
  /* stylelint-disable */
`
