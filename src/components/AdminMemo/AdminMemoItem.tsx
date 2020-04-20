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
    <Wrapper themes={theme}>
      <TextBase themes={theme}>
        <EditButton
          size="s"
          onClick={editOnClick && editOnClick}
          disabled={editOnClick ? false : true}
          square
          aria-label={editLabel}
        >
          <Icon name="fa-pen" />
        </EditButton>
        <Text themes={theme}>{comment && comment}</Text>
      </TextBase>
      {date && <Info themes={theme}>{date}</Info>}
      {author && <Info themes={theme}>{author}</Info>}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      margin-bottom: ${pxToRem(space.S)};
    `
  }}
`

const TextBase = styled(Base)<{ themes: Theme }>`
  ${({ themes }) => {
    const { pxToRem, space } = themes.size

    return css`
      padding: ${pxToRem(space.XXS)};
      margin-bottom: ${pxToRem(space.XXS)};
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
