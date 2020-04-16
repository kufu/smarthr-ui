import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { useTheme, Theme } from '../../hooks/useTheme'
import { AdminMemoItem, AdminMemoItemProps } from './AdminMemoItem'
import { Heading } from '../Heading'
import { Textarea } from '../Textarea'
import { SecondaryButton } from '../Button'

type ClickEvent = {
  preventDefault: () => void
}

interface Props {
  title?: string
  items?: AdminMemoItemProps[]
  submitButtonOnClick?: (e: ClickEvent) => void
  submitButtonLabel?: string
}

export const AdminMemo: FC<Props> = ({
  title,
  items,
  submitButtonOnClick,
  submitButtonLabel = '送信',
}) => {
  const theme = useTheme()

  return (
    <AdminMemoWrapper themes={theme}>
      {title && (
        <AdminMemoTitle type="sectionTitle" themes={theme}>
          {title}
        </AdminMemoTitle>
      )}
      {items &&
        items.map((item, index) => (
          <AdminMemoItem
            comment={item.comment}
            date={item.date}
            author={item.author}
            editOnClick={item.editOnClick}
            key={index}
          />
        ))}
      <AdminMemoTextArea themes={theme} />
      <AdminMemoSubmitButton
        onClick={submitButtonOnClick}
        disabled={submitButtonOnClick ? false : true}
      >
        {submitButtonLabel}
      </AdminMemoSubmitButton>
    </AdminMemoWrapper>
  )
}

const AdminMemoWrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      padding: ${size.pxToRem(size.space.XS)};
      background-color: ${palette.COLUMN};
      overflow: hidden;
    `
  }}
`

const AdminMemoTitle = styled(Heading)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: block;
      margin-bottom: ${pxToRem(space.XS)};
    `
  }}
`

const AdminMemoTextArea = styled(Textarea)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: block;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      margin-bottom: ${pxToRem(space.XS)};
    `
  }}
`

const AdminMemoSubmitButton = styled(SecondaryButton)`
  display: block;
  float: right;
`
