import React, { FC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  children: React.ReactNode
  className?: string
}

export const IndexNavList: FC<Props> = ({ children, ...props }) => {
  const themes = useTheme()
  return (
    <List themes={themes} {...props}>
      {children}
    </List>
  )
}

const List = styled.ul<{ themes: Theme }>(({ themes }) => {
  const { size } = themes
  return css`
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: ${size.pxToRem(size.font.TALL)};
  `
})
