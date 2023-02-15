import React, { FC, PropsWithChildren, ThHTMLAttributes, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { Button } from '../Button'
import { FaSortDownIcon, FaSortUpIcon } from '../Icon'
import { Stack } from '../Layout'

import { useThClassNames } from './useClassNames'

export type Props = PropsWithChildren<{
  /** 並び替え状態 */
  sort?: 'ascending' | 'descending' | 'none'
  /** 並び替えをクリックした時に発火するコールバック関数 */
  onClick?: () => void
}>
type ElementProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, keyof Props>

export const Th: FC<Props & ElementProps> = ({
  children,
  sort,
  onClick,
  className = '',
  ...props
}) => {
  const theme = useTheme()
  const classNames = useThClassNames()
  const wrapperClass = [className, classNames.wrapper].filter((c) => !!c).join(' ')

  return (
    <Wrapper {...props} aria-sort={sort} className={wrapperClass} themes={theme}>
      {sort ? (
        <SortButton onClick={onClick} suffix={<SortIcon sort={sort} />} themes={theme}>
          {children}
        </SortButton>
      ) : (
        children
      )}
    </Wrapper>
  )
}

const Wrapper = styled.th<{ themes: Theme; onClick?: () => void }>`
  ${({ themes: { fontSize, leading, color, space } }) => css`
    box-sizing: border-box;
    position: relative;
    height: calc(1em * ${leading.NORMAL} + ${space(0.5)} * 2);
    font-size: ${fontSize.S};
    font-weight: bold;
    padding: ${space(0.5)} ${space(1)};
    color: ${color.TEXT_BLACK};
    line-height: ${leading.NORMAL};
    vertical-align: middle;
  `}
`

const SortButton = styled(Button).attrs({ size: 's', wide: true })<{ themes: Theme }>`
  ${({ themes: { color, fontSize, space } }) => css`
    position: absolute;
    inset: 0;
    justify-content: space-between;
    border: unset;
    background-color: unset;
    padding: ${space(0.5)} ${space(1)};

    &:hover,
    &:focus {
      background-color: ${color.hoverColor(color.HEAD)};
    }

    &:focus {
      /* フォーカスリングを前に出すため */
      z-index: 1;
    }

    .smarthr-ui-Icon {
      font-size: ${fontSize.M};
    }
  `}
`

const SortIcon: FC<Pick<Props, 'sort'>> = ({ sort }) => {
  const sortLabel = useMemo(() => {
    switch (sort) {
      case 'ascending':
        return '昇順'
      case 'descending':
        return '降順'
      default:
        return '並び替えなし'
    }
  }, [sort])

  return (
    <SortIconWraper aria-label={sortLabel}>
      <FaSortUpIcon color={sort === 'ascending' ? 'TEXT_BLACK' : 'TEXT_DISABLED'} />
      <FaSortDownIcon color={sort === 'descending' ? 'TEXT_BLACK' : 'TEXT_DISABLED'} />
    </SortIconWraper>
  )
}

const SortIconWraper = styled(Stack).attrs({ as: 'span', gap: -1, inline: true })``
