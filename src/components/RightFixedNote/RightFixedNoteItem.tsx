import React, { VFC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { SecondaryButton } from '../Button'
import { FaPenIcon } from '../Icon'
import { useClassNames } from './useClassNames'

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

export const RightFixedNoteItem: VFC<Props> = ({
  id,
  text,
  date,
  author,
  onClickEdit,
  editLabel = '編集',
  className = '',
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper themes={theme} className={`${className} ${classNames.item}`}>
      <TextBase themes={theme}>
        <EditButton
          size="s"
          onClick={(e) => onClickEdit(e, id)}
          square
          aria-label={editLabel}
          className={classNames.itemEditButton}
        >
          <FaPenIcon />
        </EditButton>
        <Text themes={theme} className={classNames.itemText}>
          {text}
        </Text>
      </TextBase>
      {date && (
        <Info themes={theme} className={classNames.itemDate}>
          {date}
        </Info>
      )}
      {author && (
        <Info themes={theme} className={classNames.itemAuthor}>
          {author}
        </Info>
      )}
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
  ${({ themes: { fontSize } }) => {
    return css`
      display: block;
      padding: 0;
      margin: 0;
      font-size: ${fontSize.M};
      line-height: 1.5;
    `
  }}
`

const EditButton = styled(SecondaryButton)`
  float: right;
`

const Info = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize, palette } }) => {
    return css`
      color: ${palette.TEXT_GREY};
      font-size: ${fontSize.S};
      text-align: right;
    `
  }}
`
