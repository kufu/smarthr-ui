import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { useTheme, Theme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { SecondaryButton } from '../Button'
import { Icon } from '../Icon'

type ClickEvent = {
  preventDefault: () => void
}

interface Props {
  comment?: string
  date?: string
  author?: string
  editOnClick?: (e: ClickEvent) => void
}

export const AdminMemoItem: FC<Props> = ({ comment, date, author, editOnClick }) => {
  const theme = useTheme()

  return (
    <AdminMemoItemWrapper themes={theme}>
      <AdminMemoItemCommentBase themes={theme}>
        <AdminMemoItemCommentText themes={theme}>{comment && comment}</AdminMemoItemCommentText>
        <AdminMemoItemEditButton
          size="s"
          themes={theme}
          onClick={editOnClick && editOnClick}
          disabled={editOnClick ? false : true}
        >
          <Icon name="fa-pen" />
        </AdminMemoItemEditButton>
      </AdminMemoItemCommentBase>
      {date && <AdminMemoItemInfo themes={theme}>{date}</AdminMemoItemInfo>}
      {author && <AdminMemoItemInfo themes={theme}>{author}</AdminMemoItemInfo>}
    </AdminMemoItemWrapper>
  )
}

const AdminMemoItemWrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-bottom: ${pxToRem(space.S)};
    `
  }}
`

const AdminMemoItemCommentBase = styled(Base)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-bottom: ${pxToRem(space.S)};
    `
  }}
`

const AdminMemoItemCommentText = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-bottom: ${pxToRem(space.S)};
    `
  }}
`

const AdminMemoItemEditButton = styled(SecondaryButton)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-bottom: ${pxToRem(space.S)};
    `
  }}
`

const AdminMemoItemInfo = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-bottom: ${pxToRem(space.S)};
    `
  }}
`
