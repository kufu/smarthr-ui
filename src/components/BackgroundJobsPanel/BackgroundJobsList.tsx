import React, { HTMLAttributes, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  children?: React.ReactNode
}

type ElementProps = Omit<HTMLAttributes<HTMLUListElement>, keyof Props>

const BackgroundJobsList: VFC<Props & ElementProps> = ({ children, className = '' }) => {
  const themes = useTheme()
  const { backgroundJobsList: classNames } = useClassNames()

  return (
    <List themes={themes} className={`${className} ${classNames.wrapper}`}>
      {children}
    </List>
  )
}

const Item = styled.li``
const List = styled.ul<{ themes: Theme }>(({ themes: { spacingByChar } }) => {
  return css`
    position: fixed;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin: ${spacingByChar(1)};
    list-style: none;

    ${Item} {
      :not(:first-child) {
        margin-top: ${spacingByChar(1)};
      }
    }
  `
})

const ListAndItem: typeof BackgroundJobsList & { Item: typeof Item } = Object.assign(
  BackgroundJobsList,
  {
    Item,
  },
)
export { ListAndItem as BackgroundJobsList }
