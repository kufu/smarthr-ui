import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { useTheme, Theme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { SecondaryButton } from '../Button'
import { Icon } from '../Icon'

type ClickEvent = {
  preventDefault: () => void
}

export interface AdminMemoItemProps {
  comment?: string
  date?: string
  author?: string
  editOnClick?: (e: ClickEvent) => void
  editLabel?: string
}

export const AdminMemoItem: FC<AdminMemoItemProps> = ({
  comment,
  date,
  author,
  editOnClick,
  editLabel = '編集',
}) => {
  const theme = useTheme()

  return (
    <AdminMemoItemWrapper themes={theme}>
      <AdminMemoItemCommentBase themes={theme}>
        <AdminMemoItemEditButton
          size="s"
          onClick={editOnClick && editOnClick}
          disabled={editOnClick ? false : true}
          square
          aria-label={editLabel}
        >
          <Icon name="fa-pen" />
        </AdminMemoItemEditButton>
        <AdminMemoItemCommentText themes={theme}>{comment && comment}</AdminMemoItemCommentText>
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
      padding: ${pxToRem(space.XXS)};
      margin-bottom: ${pxToRem(space.XXS)};
      overflow: hidden;
    `
  }}
`

const AdminMemoItemCommentText = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { font, pxToRem } = themes.size

    return css`
      display: block;
      padding: 0;
      margin: 0;
      font-size: ${pxToRem(font.TALL)};
      line-height: 1.5;
    `
  }}
`

const AdminMemoItemEditButton = styled(SecondaryButton)`
  float: right;
`

const AdminMemoItemInfo = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      color: ${palette.TEXT_GREY};
      font-size: ${size.pxToRem(size.font.SHORT)};
      text-align: right;
    `
  }}
`
