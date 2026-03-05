'use client'

import {
  type ElementType,
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { useIntl } from '../../intl'
import { range } from '../../libs/lodash'
import { Cluster, Reel } from '../Layout'
import { Nav } from '../SectioningContent'

import { PaginationControllerItemButton } from './PaginationControllerItemButton'
import { PaginationItemButton } from './PaginationItemButton'

const classNameGenerator = tv({
  slots: {
    wrapper: 'smarthr-ui-Pagination shr-inline-block shr-max-w-full',
    list: 'shr-m-0.25 shr-list-none shr-ps-[unset]',
    firstListItem: 'smarthr-ui-Pagination-first',
    prevListItem: 'smarthr-ui-Pagination-prev',
    nextListItem: 'smarthr-ui-Pagination-next',
    lastListItem: 'smarthr-ui-Pagination-last',
  },
  variants: {
    withoutNumbers: {
      true: {
        firstListItem: 'shr-mr-0.5',
        prevListItem: 'shr-mr-0',
        nextListItem: 'shr-ml-0',
        lastListItem: 'shr-ml-0.5',
      },
      false: {
        prevListItem: 'shr-mr-0.5',
        nextListItem: 'shr-ml-0.5',
      },
    },
  },
})

type CommonProps = {
  /** 全ページ数 */
  total: number
  /** 現在のページ */
  current: number
  /** 現在のページの前後に表示するページ番号のボタンの数 */
  padding?: number
  /** `true` のとき、ページ番号のボタンを表示しない */
  withoutNumbers?: boolean
}

type ButtonProps = CommonProps & {
  /** ボタンを押下したときに発火するコールバック関数 */
  onClick: (pageNumber: number, e: MouseEvent<HTMLElement>) => void
  /** href属性生成用関数。設定した場合、番号やarrowがbuttonからa要素に置き換わります */
  hrefTemplate?: undefined
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  linkAs?: undefined
}
type AnchorProps = CommonProps & {
  /** リンクを押下したときに発火するコールバック関数 */
  onClick?: (href: string, e: MouseEvent<HTMLElement>) => void
  /** href属性生成用関数。設定した場合、番号やarrowがbuttonからa要素に置き換わります */
  hrefTemplate: (pageNumber: number) => string
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  linkAs?: ElementType
}

type AbstractProps = ButtonProps | AnchorProps
type Props = AbstractProps & Omit<HTMLAttributes<HTMLElement>, keyof AbstractProps>

const BUTTON_REGEX = /^button$/i
const ANCHOR_REGEX = /^a/i

const getTargetDelegateElement = (e: MouseEvent<HTMLElement>, regex: RegExp) =>
  (e.nativeEvent.composedPath() as HTMLElement[]).find((elm) => regex.test(elm.tagName))

export const Pagination: FC<Props> = (props) =>
  props.total > 1 ? <ActualPagination {...props} /> : null

const ActualPagination: FC<Props> = ({
  total,
  current,
  onClick,
  padding,
  className,
  withoutNumbers,
  hrefTemplate,
  linkAs,
  ...rest
}) => {
  const { localize } = useIntl()
  const classNames = useMemo(() => {
    const { wrapper, list, firstListItem, prevListItem, nextListItem, lastListItem } =
      classNameGenerator()
    const itemArg = { withoutNumbers: withoutNumbers || false }

    return {
      wrapper: wrapper({ className }),
      list: list(),
      firstListItem: firstListItem(itemArg),
      prevListItem: prevListItem(itemArg),
      nextListItem: nextListItem(itemArg),
      lastListItem: lastListItem(itemArg),
    }
  }, [className, withoutNumbers])

  const onDelegateClick = useMemo(() => {
    if (!onClick) {
      return undefined
    }

    if (hrefTemplate) {
      return (e: MouseEvent<HTMLElement>) => {
        const anchor = getTargetDelegateElement(e, ANCHOR_REGEX)

        if (!anchor) {
          return
        }

        const href = (anchor as HTMLAnchorElement).href

        if (href) {
          onClick(href, e)
        }
      }
    }

    return (e: MouseEvent<HTMLElement>) => {
      const button = getTargetDelegateElement(e, BUTTON_REGEX)

      if (button) {
        onClick(parseInt((button as HTMLButtonElement).value, 10), e)
      }
    }
  }, [onClick, hrefTemplate])

  const navigationLabel = useMemo(
    () =>
      localize({
        id: 'smarthr-ui/Pagination/navigationLabel',
        defaultText: 'ページネーション',
      }),
    [localize],
  )

  return (
    <Nav {...rest} className={classNames.wrapper} aria-label={navigationLabel}>
      <Reel onClick={onDelegateClick}>
        <ItemButtons
          total={total}
          current={current}
          padding={padding}
          withoutNumbers={withoutNumbers}
          hrefTemplate={hrefTemplate}
          classNames={classNames}
          linkAs={linkAs}
        />
      </Reel>
    </Nav>
  )
}

const ItemButtons = memo<
  Pick<Props, 'total' | 'current' | 'padding' | 'withoutNumbers' | 'hrefTemplate' | 'linkAs'> & {
    classNames: {
      list: string
      firstListItem: string
      prevListItem: string
      nextListItem: string
      lastListItem: string
    }
  }
>(({ total, current, padding, withoutNumbers, hrefTemplate, classNames, linkAs }) => {
  const pageNumbers = useMemo(() => {
    if (withoutNumbers) {
      return []
    }

    const actualPadding = padding ?? 4

    return range(Math.max(current - actualPadding, 1), Math.min(current + actualPadding, total) + 1)
  }, [current, total, padding, withoutNumbers])

  const controllerAttrs = useMemo(
    () => ({
      prev: {
        disabled: current === 1,
        direction: 'prev' as const,
        hrefTemplate,
        linkAs,
      },
      next: {
        disabled: current === total,
        direction: 'next' as const,
        hrefTemplate,
        linkAs,
      },
    }),
    [current, total, hrefTemplate, linkAs],
  )

  return (
    <Cluster as="ul" className={classNames.list}>
      <DoubleIconItemButton
        {...controllerAttrs.prev}
        targetPage={1}
        className={classNames.firstListItem}
      />
      <li className={classNames.prevListItem}>
        <PaginationControllerItemButton {...controllerAttrs.prev} targetPage={current - 1} />
      </li>
      {pageNumbers.map((page) => (
        <NumberItemButton
          key={page}
          page={page}
          disabled={page === current}
          hrefTemplate={hrefTemplate}
          linkAs={linkAs}
        />
      ))}
      <li className={classNames.nextListItem}>
        <PaginationControllerItemButton {...controllerAttrs.next} targetPage={current + 1} />
      </li>
      <DoubleIconItemButton
        {...controllerAttrs.next}
        targetPage={total}
        className={classNames.lastListItem}
      />
    </Cluster>
  )
})

const NumberItemButton = memo<
  Pick<Props, 'hrefTemplate' | 'linkAs'> & { page: number; disabled: boolean }
>(({ disabled, ...rest }) => (
  <li className={`smarthr-ui-Pagination-${disabled ? 'current' : 'page'}`}>
    <PaginationItemButton {...rest} disabled={disabled} />
  </li>
))

const DoubleIconItemButton = memo<
  Pick<Props, 'hrefTemplate' | 'linkAs'> & {
    disabled: boolean
    direction: 'prev' | 'next'
    targetPage: number
    className: string
  }
>(({ className, ...rest }) => (
  <li className={className}>
    <PaginationControllerItemButton {...rest} double />
  </li>
))
