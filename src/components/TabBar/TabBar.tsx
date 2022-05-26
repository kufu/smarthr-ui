import React, { HTMLAttributes, ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'
import { Reel } from '../Layout'

type Props = {
  /** タブバーの内容。通常は TabItem を並べる。 */
  children: ReactNode
  /** `true` のとき、TabBar に下線を表示する */
  bordered?: boolean
  /** コンポーネントに適用するクラス名 */
  className?: string
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'role'>

export const TabBar: VFC<Props & ElementProps> = ({
  className = '',
  bordered = true,
  children,
  ...props
}) => {
  const theme = useTheme()
  const classNames = useClassNames().tabBar
  const wrapperClass = `${className} ${classNames.wrapper}`

  return (
    <Reel {...props} role="tablist" className={wrapperClass}>
      <Inner className={bordered ? 'bordered' : undefined} themes={theme}>
        {children}
      </Inner>
    </Reel>
  )
}

const Inner = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { border } = themes

    return css`
      flex-grow: 1;

      &.bordered {
        position: relative;

        ::before {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: ${border.shorthand};
          content: '';
        }
      }
    `
  }}
`
