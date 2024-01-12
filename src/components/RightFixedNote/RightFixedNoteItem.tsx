import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Base } from '../Base'
import { Button } from '../Button'
import { FaPenIcon } from '../Icon'

import { useClassNames } from './useClassNames'

export type ItemProps = {
  /** アイテムを特定するための識別子 */
  id: string
  /** 表示するテキスト */
  text: ReactNode
  /** このアイテムが追加された日付 */
  date?: ReactNode
  /** このアイテムの著者 */
  author?: ReactNode
  /** edit ボタンを表示するかどうか */
  editable?: boolean
  /** edit ボタンの aria-label */
  editLabel?: string
  /** このコンポーネントに適用するクラス名 */
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
  editable = true,
  editLabel = '編集',
  className = '',
}) => {
  const theme = useTheme()
  const classNames = useClassNames()

  return (
    <Wrapper themes={theme} className={`${className} ${classNames.item}`}>
      <TextBase themes={theme}>
        {editable && (
          <EditButton
            size="s"
            onClick={(e) => onClickEdit(e, id)}
            square
            aria-label={editLabel}
            className={classNames.itemEditButton}
          >
            <FaPenIcon />
          </EditButton>
        )}
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
  ${({ themes: { spacingByChar } }) => css`
    margin-bottom: ${spacingByChar(1.5)};
  `}
`

const TextBase = styled(Base)<{ themes: Theme }>`
  ${({ themes: { spacingByChar } }) => css`
    padding: ${spacingByChar(0.5)};
    margin-bottom: ${spacingByChar(0.5)};
    overflow: hidden;
  `}
`

const Text = styled.p<{ themes: Theme }>`
  ${({ themes: { fontSize } }) => css`
    display: block;
    padding: 0;
    margin: 0;
    font-size: ${fontSize.M};
    line-height: 1.5;
  `}
`

const EditButton = styled(Button)`
  float: right;
`

const Info = styled.div<{ themes: Theme }>`
  ${({ themes: { fontSize, color } }) => css`
    color: ${color.TEXT_GREY};
    font-size: ${fontSize.S};
    text-align: right;
  `}
`
