import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { SecondaryButton } from '../Button'
import { FaPenIcon } from '../Icon'

export type ItemProps = {
  id: string
  text: string
  date?: string
  author?: string
  editLabel?: string
  className?: string
}

export type OnClickEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void

type Props = ItemProps & {
  onClickEdit: OnClickEdit
}

export const RightFixedNoteItem: FC<Props> = ({
  id,
  text,
  date,
  author,
  onClickEdit,
  editLabel = '編集',
  className,
}) => {
  const theme = useTheme()

  return (
    <Wrapper themes={theme} className={className}>
      <TextBase themes={theme}>
        <EditButton size="s" onClick={(e) => onClickEdit(e, id)} square aria-label={editLabel}>
          <FaPenIcon />
        </EditButton>
        <Text themes={theme}>{text}</Text>
      </TextBase>
      {date && <Info themes={theme}>{date}</Info>}
      {author && <Info themes={theme}>{author}</Info>}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      margin-bottom: ${spacingByChar(1.5)};
    `
  }}
`

const TextBase = styled(Base)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => {
    return css`
      padding: ${spacingByChar(0.5)};
      margin-bottom: ${spacingByChar(0.5)};
      overflow: hidden;
    `
  }}
`

const Text = styled.p<{ themes: Theme }>`
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

const EditButton = styled(SecondaryButton)`
  float: right;
`

const Info = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { size, palette } = themes

    return css`
      color: ${palette.TEXT_GREY};
      font-size: ${size.pxToRem(size.font.SHORT)};
      text-align: right;
    `
  }}
`
