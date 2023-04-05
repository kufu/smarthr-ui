import React, { HTMLAttributes, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { Table } from '.'

export type Props = {
  /** Tableを囲うDivのClassName指定 */
  wrapperClassName?: string
  /** TableのClassName指定 */
  tableClassName?: string
  children: React.ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLTableElement>, keyof Props>

export const FixColumnTable: React.FC<Props & ElementProps> = ({
  wrapperClassName = '',
  tableClassName = '',
  children,
  ...props
}) => {
  const tableWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = tableWrapperRef.current
    const handleScroll = () => {
      if (currentRef) {
        const stickyCells = currentRef.querySelectorAll('.fixedElement') || []
        const maxScrollLeft = currentRef.scrollWidth - currentRef.clientWidth || 0

        stickyCells.forEach((cell) => {
          if (maxScrollLeft === 0) {
            cell.classList.remove('fixed')
          } else if (currentRef.scrollLeft < maxScrollLeft || currentRef.scrollLeft === 0) {
            cell.classList.add('fixed')
          } else {
            cell.classList.remove('fixed')
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
    <Wrapper ref={tableWrapperRef} className={wrapperClassName}>
      <StyledTable {...props} className={tableClassName} fixedHead={false}>
        {children}
      </StyledTable>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  overflow: auto;
  /* stylelint-disable */
  background: linear-gradient(to right, white 6%, rgba(0, 0, 0, 0)),
    linear-gradient(to right, rgba(0, 0, 0, 0), white 80%) 0 100%,
    linear-gradient(to right, black, rgba(0, 0, 0, 0) 6%),
    linear-gradient(to left, black, rgba(0, 0, 0, 0) 0%);
  background-attachment: local, local, scroll, scroll;
`

const StyledTable = styled(Table)`
  /* Tableの背景があるとバックグラウンドの影が効かなくなるため、上書きして消している */
  white-space: nowrap;
  background: none;

  > tbody {
    background: none;
  }
`
