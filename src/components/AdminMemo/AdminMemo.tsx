import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { useTheme, Theme } from '../../hooks/useTheme'
import { AdminMemoItem, AdminMemoItemProps } from './AdminMemoItem'

interface Props {
  items?: AdminMemoItemProps[]
}

export const AdminMemo: FC<Props> = ({ items }) => {
  const theme = useTheme()

  return (
    <AdminMemoWrapper themes={theme}>
      {items &&
        items.map((item, index) => (
          <AdminMemoItem comment={item.comment} date={item.date} author={item.author} key={index} />
        ))}
    </AdminMemoWrapper>
  )
}

const AdminMemoWrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      padding: ${size.pxToRem(size.space.XS)};
      background-color: ${palette.COLUMN};
    `
  }}
`
