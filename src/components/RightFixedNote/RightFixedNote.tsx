import React, { FC, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { ItemProps, OnClickEdit, RightFixedNoteItem } from './RightFixedNoteItem'
import { Heading } from '../Heading'
import { Textarea } from '../Textarea'
import { SecondaryButton } from '../Button'

interface Props {
  title?: string
  items?: ItemProps[]
  submitLabel?: string
  width?: number
  textareaLabel?: string
  onClickEdit: OnClickEdit
  onSubmit: (e: React.FormEvent<HTMLFormElement>, text: string) => void
  className?: string
}

const TEXT_AREA_NAME = 'admin_memo_new_text'

export const RightFixedNote: FC<Props> = ({
  title,
  items,
  submitLabel = '送信',
  width = 270,
  textareaLabel,
  onClickEdit,
  onSubmit,
  className,
}) => {
  const theme = useTheme()

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const newText = (formData.get(TEXT_AREA_NAME) || '') as string

      onSubmit(e, newText)
    },
    [onSubmit],
  )

  return (
    <Wrapper themes={theme} width={width} onSubmit={handleSubmit} className={className}>
      {title && (
        <Title type="sectionTitle" themes={theme}>
          {title}
        </Title>
      )}

      {items &&
        items.map((item) => (
          <RightFixedNoteItem key={item.id} {...item} onClickEdit={onClickEdit} />
        ))}

      <TextArea
        name={TEXT_AREA_NAME}
        themes={theme}
        aria-label={textareaLabel ? textareaLabel : title}
      />

      <SubmitButton type="submit">{submitLabel}</SubmitButton>
    </Wrapper>
  )
}

const Wrapper = styled.form<{ themes: Theme; width: number }>`
  ${({ themes, width }) => {
    const { size, palette } = themes

    return css`
      width: ${size.pxToRem(width)};
      padding: ${size.pxToRem(size.space.XS)};
      background-color: ${palette.COLUMN};
      box-shadow: rgba(0, 0, 0, 0.1) 0 0 8px;
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
