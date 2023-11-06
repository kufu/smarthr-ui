import React, {
  AriaAttributes,
  FC,
  PropsWithChildren,
  ReactNode,
  ThHTMLAttributes,
  useMemo,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { FaSortDownIcon, FaSortUpIcon } from '../Icon'
import { VisuallyHiddenText } from '../VisuallyHiddenText'

import { useThClassNames } from './useClassNames'
import { useReelShadow } from './useReelShadow'

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
  /** `true` のとき、TableReel内で固定表示になる */
  fixed?: boolean
}>
type ElementProps = Omit<ThHTMLAttributes<HTMLTableCellElement>, keyof Props | 'onClick'>

const SORT_DIRECTION_LABEL = {
  asc: '昇順',
  desc: '降順',
  none: '並び替えなし',
}

export const Th: FC<Props & ElementProps> = ({
  children,
  sort,
  onSort,
  decorators,
  fixed = false,
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
  const ariaSortProps = useMemo<
    | {
        'aria-sort': AriaAttributes['aria-sort']
      }
    | undefined
  >(
    () =>
      sort && {
        'aria-sort': sort === 'none' ? 'none' : `${sort}ending`,
      },
    [sort],
  )

  return (
    <Wrapper
      {...ariaSortProps}
      {...props}
      className={`${wrapperClass} ${fixed ? 'fixedElement' : ''}`}
      themes={theme}
      fixed={fixed}
    >
      {sort ? (
        <SortButton themes={theme} onClick={onSort}>
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

const Wrapper = styled.th<{ themes: Theme; fixed: boolean }>`
  ${({ themes: { fontSize, leading, color, shadow, space }, fixed }) => css`
    font-size: ${fontSize.S};
    font-weight: bold;
    padding: ${space(0.75)} ${space(1)};
    text-align: left;
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

    /* これ以降の記述はTableReel内で'fixed'を利用した際に追従させるために必要 */
    &.fixedElement {
      ${useReelShadow({ showShadow: false, direction: 'right' })}
    }

    ${fixed &&
    css`
      &.fixed {
        position: sticky;
        right: 0;

        &::after {
          opacity: 1;
        }
      }
    `}

    @media (forced-colors: active) {
      &[aria-sort='none'] {
        .smarthr-ui-Icon {
          fill: GrayText;
        }
      }

      &[aria-sort='ascending'] {
        .smarthr-ui-Icon:first-child {
          fill: CanvasText;
        }
        .smarthr-ui-Icon:last-child {
          fill: GrayText;
        }
      }

      &[aria-sort='descending'] {
        .smarthr-ui-Icon:first-child {
          fill: GrayText;
        }
        .smarthr-ui-Icon:last-child {
          fill: CanvasText;
        }
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
    <FaSortUpIcon color={sort === 'asc' ? 'TEXT_BLACK' : 'TEXT_DISABLED'} />
    <FaSortDownIcon color={sort === 'desc' ? 'TEXT_BLACK' : 'TEXT_DISABLED'} />
  </SortIconWraper>
)

const SortIconWraper = styled.span`
  display: inline-flex;
  flex-direction: column;

  .smarthr-ui-Icon + .smarthr-ui-Icon {
    margin-top: -1em;
  }
`
