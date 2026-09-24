'use client'

import {
  Children,
  type ComponentPropsWithoutRef,
  Fragment,
  type ReactElement,
  type ReactNode,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  useRef,
  useState,
} from 'react'
import { tv } from 'tailwind-variants'

import { useAnimationFrame } from '../../../../hooks/client/useAnimationFrame'
import { useEnhancedEffect } from '../../../../hooks/client/useEnhancedEffect'
import { useMergeRefs } from '../../../../hooks/client/useMergeRefs'
import { useLatest } from '../../../../hooks/useLatest'

type BaseProps = {
  /**
   * 収まらなかったアイテムを表示するための描画関数
   *
   * 受け取るのは渡した要素そのもの（元の並び順・元の key）なので、
   * そのまま描画するほか、`item.props` から元の値を読んで別の要素を組み立てることもできる。
   * まとめたアイテムは並びからは取り除かれるため、そのまま描画しても DOM に2つ存在することはない
   */
  renderTucked: (items: Array<ReactElement<any>>) => ReactNode

  /**
   * 折り返して表示する最大行数
   * @default 1
   */
  maxLines?: number

  /**
   * 収まらないときのアイテムの省略方法
   * - 'partial': 収まる分は表示し、残りだけを renderTucked に回す
   * - 'all': 1つでも溢れたら、すべて renderTucked に回す
   * @default 'partial'
   */
  collapse?: 'partial' | 'all'

  /**
   * 並べるアイテム。子要素1つを1アイテムとして扱う（Fragment は展開する）。要素以外（文字列など）は無視する。
   * アイテム同士の間隔や揃え方は持たず、親（Cluster など）の gap・align・justify を引き継ぐ
   */
  children: ReactNode
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'div'>, keyof BaseProps>

type Item = {
  key: string
  node: ReactElement<any>
}

const ITEM_KEY_ATTR = 'data-tuck-item'
const TRIGGER_ATTR = 'data-tuck-trigger'
const MEASURED_ATTR = 'data-measured'

const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-Tuck',
      'shr-min-w-0',
      // HINT: 並べ方は持たず、親（Cluster など）の gap・align-items・justify-content を group まで引き継ぐ
      '[align-items:inherit] [gap:inherit] [justify-content:inherit]',
    ],
    // HINT: 全アイテムを表示した幅を、親レイアウトに伝える自然な幅（内在サイズ）にするための要素。
    // 表示件数によって内在サイズが変わると、親の折り返し判定と表示件数の判定が互いに影響して
    // 振動しうるため、実際の並び(group)とは切り離している
    sizer: ['smarthr-ui-Tuck-sizer', 'shr-flex shr-h-0 shr-flex-wrap shr-overflow-hidden'],
    group: [
      'smarthr-ui-Tuck-group',
      'shr-m-0 shr-flex shr-flex-wrap shr-p-0',
      '[align-items:inherit] [gap:inherit] [justify-content:inherit]',
      // HINT: 内在サイズは sizer が担うため、group 自身は内在サイズに影響させない
      '[contain:inline-size]',
      // HINT: 計測が終わるまで(SSR 直後など)は溢れた分でページに横スクロールが出ないようにする
      // tailwind が検出できるよう、属性名は MEASURED_ATTR と同じものをベタ書きしている
      '[&:not([data-measured])]:shr-overflow-hidden',
    ],
    item: ['smarthr-ui-Tuck-item', 'shr-flex shr-shrink-0'],
    trigger: ['smarthr-ui-Tuck-trigger', 'shr-flex shr-shrink-0'],
  },
})

const flattenItems = (children: ReactNode, keyPrefix = ''): Item[] =>
  Children.toArray(children).flatMap((child, index) => {
    if (!isValidElement(child)) {
      return []
    }

    // HINT: Children.toArray は key に接頭辞（'.$' など）を付けるため、渡された key に戻す。
    // renderTucked 側で key から元データを引けるようにするのと、Fragment 展開時に key が重複しないようにするため
    const key = `${keyPrefix}${child.key === null ? index : child.key.replace(/^\.\$?/, '')}`

    if (child.type === Fragment) {
      return flattenItems(
        (child as ReactElement<{ children?: ReactNode }>).props.children,
        `${key}/`,
      )
    }

    return [{ key, node: cloneElement(child, { key }) }]
  })

const countLines = (widths: number[], gap: number, available: number) => {
  let lines = 0
  let lineWidth = 0

  for (const width of widths) {
    // HINT: 0.01はブラウザの丸め誤差吸収用
    if (lines > 0 && lineWidth + gap + width <= available + 0.01) {
      lineWidth += gap + width
    } else {
      lines++
      lineWidth = width
    }
  }

  return lines
}

const countVisibleItems = (
  widths: number[],
  { gap, available, maxLines, collapse, triggerWidth }: Measurement,
) => {
  const fits = (visibleWidths: number[]) => countLines(visibleWidths, gap, available) <= maxLines

  if (fits(widths)) {
    return widths.length
  }

  if (collapse === 'all') {
    return 0
  }

  // HINT: 表示する件数を1件ずつ減らし、トリガーと合わせて収まる最大の件数を探す
  for (let count = widths.length - 1; count > 0; count--) {
    if (fits([...widths.slice(0, count), triggerWidth])) {
      return count
    }
  }

  return 0
}

type Measurement = {
  gap: number
  available: number
  maxLines: number
  collapse: NonNullable<Props['collapse']>
  triggerWidth: number
}

export const Tuck = forwardRef<HTMLDivElement, Props>(
  ({ children, renderTucked, maxLines = 1, collapse = 'partial', className, ...rest }, ref) => {
    const actualMaxLines = Math.max(1, Math.floor(maxLines))
    const [tuckedKeys, setTuckedKeys] = useState<string[]>([])
    const groupRef = useRef<HTMLElement>(null)
    const sizerRef = useRef<HTMLDivElement>(null)
    const measuredRef = useRef({
      // HINT: トリガーの幅は「+7」が「+6」より狭いなど、件数に対して単調に増えるとは限らない。
      // 表示中のトリガーの幅で判定すると、広いトリガーでは収まらないので件数を増やす → 狭くなったので戻す…と
      // 状態が行き来し、更新が止まらなくなる。これまでに測った最大の幅を使えば判定が一方向にしか変わらず収束する
      triggerWidth: 0,
      // HINT: まとめたアイテムはアンマウントするため、表示中に測った幅を key ごとに覚えておき判定に使う。
      // まとめている間に中身の幅が変わっても分からない。広がった場合は並びに戻した時点で測り直され、
      // 描画前に再判定されるため見た目には出ないが、狭まった場合は本来収まるのにまとめたままになることがある
      itemWidths: new Map<string, number>(),
    })
    const resizeFrame = useAnimationFrame()

    const items = flattenItems(children)
    const tuckedKeySet = new Set(tuckedKeys)
    const tuckedItems = items.filter((item) => tuckedKeySet.has(item.key)).map((item) => item.node)

    const latest = useLatest({
      items,
      tuckedKeys,
      maxLines: actualMaxLines,
      collapse,
      resizeFrame,
    })

    const functions = useMemo(() => {
      const update = () => {
        const group = groupRef.current
        const sizer = sizerRef.current
        if (!group || !sizer) {
          return
        }

        const measured = measuredRef.current
        const widthCache = measured.itemWidths
        for (const child of Array.from(group.children)) {
          const key = child.getAttribute(ITEM_KEY_ATTR)
          const width = child.getBoundingClientRect().width

          if (key !== null) {
            widthCache.set(key, width)
            continue
          }

          if (!child.hasAttribute(TRIGGER_ATTR)) {
            continue
          }

          measured.triggerWidth = Math.max(measured.triggerWidth, width)
        }

        const currentKeys = new Set(latest.items.map((item) => item.key))

        // HINT: 取り除かれたアイテムの幅は使わないため捨てる
        for (const key of widthCache.keys()) {
          if (!currentKeys.has(key)) {
            widthCache.delete(key)
          }
        }

        // HINT: 幅が分からないアイテムがある場合（取り除かれた後に同じ key で戻ってきた場合など）は、
        // いったんすべて並びに戻して測り直す。描画途中で DOM が追いついていない場合は、コミット後の再実行に任せる
        if (latest.items.some((item) => !widthCache.has(item.key))) {
          if (latest.tuckedKeys.length > 0) {
            setTuckedKeys([])
          }

          return
        }

        const widths = latest.items.map((item) => widthCache.get(item.key) as number)
        const gap = parseFloat(getComputedStyle(group).columnGap) || 0

        // HINT: 各要素の幅の合計が、親レイアウトに伝える自然な幅になる
        Array.from(sizer.children).forEach((sizerItem, i) => {
          const width = `${widths[i] + (i < widths.length - 1 ? gap : 0)}px`
          if ((sizerItem as HTMLElement).style.width !== width) {
            ;(sizerItem as HTMLElement).style.width = width
          }
        })

        const visibleCount = countVisibleItems(widths, {
          gap,
          available: group.getBoundingClientRect().width,
          maxLines: latest.maxLines,
          collapse: latest.collapse,
          triggerWidth: measured.triggerWidth,
        })
        const nextTuckedKeys = latest.items.slice(visibleCount).map((item) => item.key)

        if (!group.hasAttribute(MEASURED_ATTR)) {
          group.setAttribute(MEASURED_ATTR, '')
        }

        if (JSON.stringify(nextTuckedKeys) !== JSON.stringify(latest.tuckedKeys)) {
          setTuckedKeys(nextTuckedKeys)
        }
      }

      return {
        update,
        observerRef: (node: HTMLElement | null) => {
          if (!node) {
            return
          }

          // HINT: update は計測対象の大きさを変えうるため、ResizeObserver のコールバックから同期的に呼ぶと
          // 「ResizeObserver loop completed with undelivered notifications」を発生させる。次フレームに逃がす
          const resizeObserver = new ResizeObserver(() => latest.resizeFrame.request(update))
          const observeChildren = () => {
            resizeObserver.disconnect()
            resizeObserver.observe(node)
            for (const child of Array.from(node.children)) {
              resizeObserver.observe(child)
            }
          }
          observeChildren()
          // HINT: アイテムやトリガーの増減で監視対象を張り直す
          const mutationObserver = new MutationObserver(observeChildren)
          mutationObserver.observe(node, { childList: true })

          return () => {
            latest.resizeFrame.cancel()
            mutationObserver.disconnect()
            resizeObserver.disconnect()
          }
        },
      }
    }, [latest])

    const mergedGroupRef = useMergeRefs(groupRef, functions.observerRef)

    // HINT: 描画のたびに、ペイント前に判定し直す。
    // アイテムの増減・並び替えや設定の変更だけでなく、表示中のアイテムの中身（ラベルなど）が変わった場合も、
    // ResizeObserver の通知（次フレーム以降）を待たずに確定させ、はみ出した状態が一瞬描画されないようにするため。
    // まとめるアイテムが変わった後も呼ばれるので、トリガーや並びに戻したアイテムの幅を測り直して収束させる
    useEnhancedEffect(() => {
      functions.update()
    })

    const classNames = useMemo(() => {
      const { wrapper, sizer, group, item, trigger } = classNameGenerator()
      return {
        wrapper: wrapper({ className }),
        sizer: sizer(),
        group: group(),
        item: item(),
        trigger: trigger(),
      }
    }, [className])

    return (
      <div {...rest} ref={ref} className={classNames.wrapper}>
        <div ref={sizerRef} className={classNames.sizer} aria-hidden>
          {items.map((item) => (
            <div key={item.key} />
          ))}
        </div>
        <div ref={mergedGroupRef} className={classNames.group}>
          {items.map((item) =>
            // HINT: まとめたアイテムは renderTucked 側で描画されうるため、並びからは取り除いて二重に存在しないようにする
            tuckedKeySet.has(item.key) ? null : (
              <div key={item.key} className={classNames.item} data-tuck-item={item.key}>
                {item.node}
              </div>
            ),
          )}
          {tuckedItems.length > 0 && (
            <div className={classNames.trigger} data-tuck-trigger="">
              {renderTucked(tuckedItems)}
            </div>
          )}
        </div>
      </div>
    )
  },
)
