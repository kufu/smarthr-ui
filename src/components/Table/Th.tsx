import React, { FC, PropsWithChildren, ReactNode, ThHTMLAttributes, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaSortDownIcon, FaSortUpIcon } from '../Icon'
import { Stack } from '../Layout'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { useThClassNames } from './useClassNames'

type sortTypes = keyof typeof SORT_DIRECTION_LABEL
export type Props = PropsWithChildren<{
  /** 並び替え状態 */
  sort?: sortTypes
  /** 並び替えをクリックした時に発火するコールバック関数 */
  onSort?: () => void
  /** 文言を変更するための関数 */
  decorators?: {
    sortDirectionIconAlt: (text: string, { sort }: { sort: sortTypes }) => ReactNode
  }
}>
type ElementProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, keyof Props | 'onClick'>

const SORT_DIRECTION_LABEL = {
  ascending: '昇順',
  descending: '降順',
  none: '並び替えなし',
}

export const Th: FC<Props & ElementProps> = ({
  children,
  sort,
  onSort,
  decorators,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useThClassNames()
  const wrapperClass = [className, classNames.wrapper].filter((c) => !!c).join(' ')

  const sortLabel = useMemo(
    () =>
      sort &&
      (decorators?.sortDirectionIconAlt?.(SORT_DIRECTION_LABEL[sort], { sort }) ||
        SORT_DIRECTION_LABEL[sort]),
    [decorators, sort],
  )

  return (
    <Wrapper
      {...props}
      onSort={sort && onSort}
      aria-sort={sort}
      className={wrapperClass}
      themes={theme}
    >
      {sort ? (
        <SortButton themes={theme}>
          {children}
          <SortIcon sort={sort} />
          <VisuallyHiddenText>{sortLabel}</VisuallyHiddenText>
        </SortButton>
      ) : (
        children
      )}
    </Wrapper>
  )
}

const Wrapper = styled.th<{ themes: Theme; onSort?: () => void }>`
  ${({ themes: { fontSize, leading, color, shadow, space } }) => css`
    box-sizing: border-box;
    font-size: ${fontSize.S};
    font-weight: bold;
    padding: ${space(0.75)} ${space(1)};
    color: ${color.TEXT_BLACK};
    line-height: ${leading.TIGHT};
    vertical-align: middle;

    &[aria-sort] {
      cursor: pointer;

      &:hover {
        background-color: ${color.hoverColor(color.HEAD)};
      }

      /* :focus-visible-within の代替 */
      &:has(:focus-visible) {
        ${shadow.focusIndicatorStyles}
      }
    }
  `}
`

const SortButton = styled.button<{
  themes: Theme
}>`
  ${({ themes: { fontSize, space } }) => css`
    cursor: pointer;
    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    column-gap: ${space(0.5)};
    justify-content: space-between;
    margin: ${space(-0.75)} ${space(-1)};
    border: unset;
    outline: unset;
    background-color: unset;
    padding: ${space(0.75)} ${space(1)};
    text-align: left;
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;

    .smarthr-ui-Icon {
      font-size: ${fontSize.M};
    }
  `}
`

const SortIcon: FC<Pick<Props, 'sort'>> = ({ sort }) => (
  <SortIconWraper>
    <FaSortUpIcon color={sort === 'ascending' ? 'TEXT_BLACK' : 'TEXT_DISABLED'} />
    <FaSortDownIcon color={sort === 'descending' ? 'TEXT_BLACK' : 'TEXT_DISABLED'} />
  </SortIconWraper>
)

const SortIconWraper = styled(Stack).attrs({ as: 'span', gap: -1, inline: true })``
