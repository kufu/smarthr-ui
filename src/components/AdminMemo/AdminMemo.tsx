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
  onClickSubmit?: (e: ClickEvent) => void
  submitLabel?: string
  width?: number
  textareaLabel?: string
}

export const AdminMemo: FC<Props> = ({
  title,
  items,
  onClickSubmit,
  submitLabel = '送信',
  width = 270,
  textareaLabel,
}) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme} width={width}>
      {title && (
        <Title type="sectionTitle" themes={theme}>
          {title}
        </Title>
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
      <TextArea themes={theme} aria-label={textareaLabel ? textareaLabel : title && title} />
      <SubmitButton onClick={onClickSubmit} disabled={!onClickSubmit}>
        {submitLabel}
      </SubmitButton>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme; width: number }>`
  ${({ themes, width }) => {
    const { size, palette } = themes

    return css`
      width: ${size.pxToRem(width)};
      padding: ${size.pxToRem(size.space.XS)};
      background-color: ${palette.COLUMN};
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;
      overflow: hidden scroll;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
    `
  }}
`

const Title = styled(Heading)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: block;
      margin-bottom: ${pxToRem(space.XS)};
    `
  }}
`

const TextArea = styled(Textarea)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      display: block;
      width: 100%;
      max-width: 100%;
      min-width: 100%;
      box-sizing: border-box;
      margin-bottom: ${pxToRem(space.XS)};
    `
  }}
`

const SubmitButton = styled(SecondaryButton)`
  display: block;
  float: right;
`
