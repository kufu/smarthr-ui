import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

export type Props = {
  /** Tableを囲うDivのClassName指定 */
  wrapperClassName?: string
  /** TableのClassName指定 */
  children: React.ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const TableReel: React.FC<Props & ElementProps> = ({
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
            setShowShadow(maxScrollLeft === 0 && scrollLeft === 0 ? false : true)
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

export const reelShadow = ({
  showShadow = true,
  direction = 'left',
}: {
  showShadow?: boolean
  direction?: 'left' | 'right'
}) => {
  return `
    &::after {
      content: '';
      position: absolute;
      z-index: 0;
      left: ${direction === 'left' ? '0' : '-12px'};
      top: 0;
      width: 12px;
      pointer-events: none; /* 影の領域が広すぎるとクリッカブルエリアを侵食するので無効化 */
      height: 100%;
      background: linear-gradient(${
        direction === 'left' ? '90deg' : '-90deg'
      }, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
      opacity: ${showShadow ? 1 : 0};
      transition: opacity 0.2s;
    }
  `
}

const Shadow = styled.div<{ showShadow: boolean }>`
  ${({ showShadow }) => css`
    position: relative;

    ${reelShadow({ showShadow })}
  `}
`

const Wrapper = styled.div`
  position: relative;
  overflow: auto;
`
