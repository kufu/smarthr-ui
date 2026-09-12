import {
  type ComponentProps,
  type ElementType,
  type FC,
  type HTMLAttributes,
  type MouseEvent,
  memo,
  useMemo,
} from 'react'
import { tv } from 'tailwind-variants'

import { range } from '../../libs/lodash'
import { Cluster, Reel } from '../Layout'

import { PaginationControllerItemButton } from './PaginationControllerItemButton'
import { PaginationItemButton } from './PaginationItemButton'
import { Wrapper } from './client'

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
  /** next/linkなどのカスタムコンポーネントを指定します。指定がない場合はデフォルトで `a` タグが使用されます。 */
  linkAs?: ElementType
}

type ButtonProps = CommonProps & {
  /** ボタンを押下したときに発火するコールバック関数 */
  onClick: (pageNumber: number, e: MouseEvent<HTMLElement>) => void
  /** href属性生成用関数。設定した場合、番号やarrowがbuttonからa要素に置き換わります */
  hrefTemplate?: undefined
}
type AnchorProps = CommonProps & {
  /** リンクを押下したときに発火するコールバック関数 */
  onClick?: (href: string, e: MouseEvent<HTMLElement>) => void
  /** href属性生成用関数。設定した場合、番号やarrowがbuttonからa要素に置き換わります */
  hrefTemplate: (pageNumber: number) => string
}

type BaseProps = ButtonProps | AnchorProps
type Props = BaseProps & Omit<HTMLAttributes<HTMLElement>, keyof BaseProps>

export const Pagination: FC<Props> = (props) =>
  props.total > 1 ? <ActualPagination {...props} /> : null

const ActualPagination: FC<Props> = ({
  total,
  current,
  padding,
  className,
  withoutNumbers,
  hrefTemplate,
  onClick,
  linkAs,
  ...rest
}) => {
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
  }, [withoutNumbers, className])

  // HINT: onClick/hrefTemplateはButtonProps/AnchorPropsの判別可能ユニオンで、
  // 分割代入した時点で個々のプロパティ型がユニオン展開され、TypeScript上は
  // 組み合わせの整合性を検証できなくなる。実行時にはPropsとして渡された時点で
  // 整合した組み合わせしか存在しないため、まとめて一度だけWrapperの型にキャストする
  const wrapperProps = {
    ...rest,
    onClick,
    hrefTemplate,
    className: classNames.wrapper,
  } as ComponentProps<typeof Wrapper>

  return (
    <Wrapper {...wrapperProps}>
      <ItemButtons
        linkAs={linkAs}
        total={total}
        current={current}
        withoutNumbers={withoutNumbers}
        hrefTemplate={hrefTemplate}
        padding={padding}
        classNames={classNames}
      />
    </Wrapper>
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

  const prevAttrs = {
    disabled: current === 1,
    direction: 'prev' as const,
    hrefTemplate,
    linkAs,
  }
  const nextAttrs = {
    disabled: current === total,
    direction: 'next' as const,
    hrefTemplate,
    linkAs,
  }

  return (
    <Reel>
      <Cluster as="ul" className={classNames.list}>
        <DoubleIconItemButton {...prevAttrs} targetPage={1} className={classNames.firstListItem} />
        <li className={classNames.prevListItem}>
          <PaginationControllerItemButton {...prevAttrs} targetPage={current - 1} />
        </li>
        {pageNumbers.map((page) => (
          <NumberItemButton
            key={page}
            linkAs={linkAs}
            disabled={page === current}
            page={page}
            hrefTemplate={hrefTemplate}
          />
        ))}
        <li className={classNames.nextListItem}>
          <PaginationControllerItemButton {...nextAttrs} targetPage={current + 1} />
        </li>
        <DoubleIconItemButton
          {...nextAttrs}
          targetPage={total}
          className={classNames.lastListItem}
        />
      </Cluster>
    </Reel>
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
