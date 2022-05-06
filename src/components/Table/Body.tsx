import React, { HTMLAttributes, VFC } from 'react'
import styled from 'styled-components'
import { TableGroupContext } from './Table'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type ElementType = HTMLAttributes<HTMLTableSectionElement>

/**
 * @deprecated Body コンポーネントは非推奨です。tbody 要素に置き換えてください。
 */
export const Body: VFC<ElementType> = ({ className = '', children, ...props }) => {
  const classNames = useClassNames().body
  const theme = useTheme()
  return (
    <Wrapper {...props} themes={theme} className={`${className} ${classNames.wrapper}`}>
      <TableGroupContext.Provider value={{ group: 'body' }}>{children}</TableGroupContext.Provider>
    </Wrapper>
  )
}

const Wrapper = styled.tbody<{ themes: Theme }>`
  background-color: ${({ themes }) => themes.color.WHITE};
`
