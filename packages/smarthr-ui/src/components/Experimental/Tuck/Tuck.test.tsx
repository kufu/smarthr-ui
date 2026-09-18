import { act, render, screen } from '@testing-library/react'

import { Tuck } from './client'

import type { ComponentProps } from 'react'

// HINT: jsdom はレイアウトを計算しないため、data-width を幅として返すようにする。
// group 要素は groupWidth を、それ以外は内側の data-width を持つ要素の幅を返す
let groupWidth = 0

const Item = ({ label, width }: { label: string; width: number }) => (
  <span data-width={width}>{label}</span>
)

// HINT: まとめたアイテムは並びから取り除かれる
const isTucked = (label: string) =>
  screen.queryByText(label, { selector: '.smarthr-ui-Tuck-item > *' }) === null

describe('Tuck', () => {
  let resizeCallbacks: Array<() => void> = []
  const OriginalResizeObserver = global.ResizeObserver

  beforeEach(() => {
    resizeCallbacks = []
    global.ResizeObserver = class {
      constructor(callback: () => void) {
        resizeCallbacks.push(callback)
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: Element,
    ) {
      const width = this.classList.contains('smarthr-ui-Tuck-group')
        ? groupWidth
        : Number(this.querySelector<HTMLElement>('[data-width]')?.dataset.width ?? 0)

      return { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0 } as DOMRect
    })
  })

  afterEach(() => {
    global.ResizeObserver = OriginalResizeObserver
    vi.restoreAllMocks()
  })

  const renderTuck = (props: Partial<ComponentProps<typeof Tuck>> = {}) => {
    const renderTucked = vi.fn((items: unknown[]) => <Item width={30} label={`+${items.length}`} />)

    const result = render(
      <Tuck {...props} renderTucked={renderTucked}>
        <Item width={100} label="A" />
        <Item width={100} label="B" />
        <Item width={100} label="C" />
        <Item width={100} label="D" />
      </Tuck>,
    )

    return { ...result, renderTucked }
  }

  it('すべて収まる場合はそのまま表示し、renderTucked を呼ばない', () => {
    groupWidth = 400

    const { renderTucked } = renderTuck()

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, false, false])
    expect(renderTucked).not.toHaveBeenCalled()
  })

  it('収まらない場合は、トリガーと合わせて収まる分だけ表示し、残りを renderTucked に渡す', () => {
    // A + B + トリガー(30) = 230 は収まるが、A + B + C + トリガー = 330 は収まらない
    groupWidth = 300

    const { renderTucked } = renderTuck()

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])
    // key を渡していない子要素は、並び順の番号が key になる
    expect(renderTucked).toHaveBeenLastCalledWith([
      expect.objectContaining({ key: '2' }),
      expect.objectContaining({ key: '3' }),
    ])
    expect(screen.getByText('+2')).toBeInTheDocument()
  })

  it('maxLines を指定すると、その行数まで使って表示する', () => {
    // 1行に1件しか並ばない幅。1行なら A + トリガーまでだが、2行なら 1行目に A、2行目に B + トリガーが収まる
    groupWidth = 199

    renderTuck({ maxLines: 2 })

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])
  })

  it('collapse="all" のとき、1つでも溢れたらすべて renderTucked に渡す', () => {
    groupWidth = 350

    const { renderTucked } = renderTuck({ collapse: 'all' })

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([true, true, true, true])
    expect(renderTucked).toHaveBeenLastCalledWith([
      expect.objectContaining({ key: '0' }),
      expect.objectContaining({ key: '1' }),
      expect.objectContaining({ key: '2' }),
      expect.objectContaining({ key: '3' }),
    ])
  })

  it('幅が広がると、隠していたアイテムを再び表示する', () => {
    groupWidth = 300

    renderTuck()

    expect(isTucked('D')).toBe(true)

    groupWidth = 400
    act(() => {
      resizeCallbacks.forEach((callback) => callback())
    })

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, false, false])
    expect(screen.queryByText('+2')).not.toBeInTheDocument()
  })

  describe('children が変わったとき', () => {
    const renderTucked = (items: unknown[]) => <Item width={30} label={`+${items.length}`} />
    const template = (items: Array<{ label: string; width: number }>) => (
      <Tuck renderTucked={renderTucked}>
        {items.map(({ label, width }) => (
          <Item key={label} width={width} label={label} />
        ))}
      </Tuck>
    )
    const A = { label: 'A', width: 100 }
    const B = { label: 'B', width: 100 }
    const C = { label: 'C', width: 100 }
    const D = { label: 'D', width: 100 }

    it('アイテムが増えると、増えたアイテムを測ってから判定する', () => {
      groupWidth = 300

      const { rerender } = render(template([A, B]))

      expect(['A', 'B'].map(isTucked)).toEqual([false, false])

      rerender(template([A, B, C, D]))

      expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])
      expect(screen.getByText('+2')).toBeInTheDocument()
    })

    it('アイテムが減ると、まとめていたアイテムを覚えている幅で判定して並びに戻す', () => {
      groupWidth = 300

      const { rerender } = render(template([A, B, C, D]))

      expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])

      rerender(template([A, B, D]))

      expect(['A', 'B', 'D'].map(isTucked)).toEqual([false, false, false])
      expect(screen.queryByText('+1')).not.toBeInTheDocument()
    })

    it('並び順が変わると、新しい並び順で判定する', () => {
      groupWidth = 300

      const { rerender } = render(template([A, B, C, D]))

      rerender(template([D, C, B, A]))

      expect(['D', 'C', 'B', 'A'].map(isTucked)).toEqual([false, false, true, true])
    })

    it('表示中のアイテムの中身が変わると、ResizeObserver を待たずに描画時点で判定し直す', () => {
      groupWidth = 400

      const { rerender } = render(template([A, B, C, D]))

      expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, false, false])

      rerender(template([A, { label: 'B', width: 150 }, C, D]))

      expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, false, true])
    })

    it('Tuck の再描画を伴わずに表示中のアイテムの幅が変わった場合は、ResizeObserver で検知して判定し直す', () => {
      groupWidth = 400

      render(template([A, B, C, D]))

      expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, false, false])

      // アイテム内部の state による変化などを想定し、React を介さずに幅だけ変える
      screen.getByText('B').setAttribute('data-width', '150')
      act(() => {
        resizeCallbacks.forEach((callback) => callback())
      })

      expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, false, true])
    })
  })

  it('renderTucked で items を描画しても、同じアイテムが DOM に2つ存在しない', () => {
    groupWidth = 300

    render(
      <Tuck renderTucked={(items) => <div data-width={30}>{items}</div>}>
        <Item width={100} label="A" />
        <Item width={100} label="B" />
        <Item width={100} label="C" />
        <Item width={100} label="D" />
      </Tuck>,
    )

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])
    expect(screen.getAllByText('C')).toHaveLength(1)
    expect(screen.getByText('C').closest('[data-tuck-trigger]')).not.toBeNull()
  })

  it('renderTucked には、渡した key と props のまま要素が渡る', () => {
    groupWidth = 300

    const renderTucked = vi.fn((items: Array<{ key: string | null; props: { label: string } }>) => (
      <Item width={30} label={items.map((item) => item.props.label).join()} />
    ))

    render(
      <Tuck renderTucked={renderTucked}>
        <Item key="a" width={100} label="A" />
        <Item key="b" width={100} label="B" />
        <Item key="c" width={100} label="C" />
        <Item key="d" width={100} label="D" />
      </Tuck>,
    )

    // props から元の値を読めるため、index を渡さなくても元データを引ける
    expect(screen.getByText('C,D')).toBeInTheDocument()
    expect(renderTucked).toHaveBeenLastCalledWith([
      expect.objectContaining({ key: 'c' }),
      expect.objectContaining({ key: 'd' }),
    ])
  })

  it('まとめている間に幅が広がったアイテムは、並びに戻したときに測り直して判定する', () => {
    groupWidth = 300

    const renderTucked = (items: unknown[]) => <Item width={30} label={`+${items.length}`} />
    const template = (dWidth: number) => (
      <Tuck renderTucked={renderTucked}>
        <Item width={100} label="A" />
        <Item width={100} label="B" />
        <Item width={100} label="C" />
        <Item width={dWidth} label="D" />
      </Tuck>
    )

    const { rerender } = render(template(100))

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])

    // D はまとめられているので、幅が変わったことはまだ分からない
    rerender(template(250))
    groupWidth = 400
    act(() => {
      resizeCallbacks.forEach((callback) => callback())
    })

    // 覚えていた幅(100)なら全件収まるが、並びに戻した D を測り直すと収まらないため、D だけまとめ直す
    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, false, true])
  })

  it('トリガーの幅が件数によって増減しても、表示件数が行き来せずに収まる', () => {
    // 「+1」は幅60、「+2」は幅20。現在のトリガーの幅だけで判定すると、
    // +1(60) では C まで収まらず2件隠す → +2(20) なら C も収まるので1件に戻す…を繰り返す
    groupWidth = 330

    const renderTucked = vi.fn((items: unknown[]) => (
      <Item width={items.length === 1 ? 60 : 20} label={`+${items.length}`} />
    ))

    render(
      <Tuck renderTucked={renderTucked}>
        <Item width={100} label="A" />
        <Item width={100} label="B" />
        <Item width={100} label="C" />
        <Item width={100} label="D" />
      </Tuck>,
    )

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])
  })

  it('Fragment は展開して、中身を1件ずつのアイテムとして扱う', () => {
    groupWidth = 300

    const renderTucked = vi.fn((items: unknown[]) => <Item width={30} label={`+${items.length}`} />)

    render(
      <Tuck renderTucked={renderTucked}>
        <Item width={100} label="A" />
        <>
          <Item width={100} label="B" />
          <Item width={100} label="C" />
        </>
        <Item width={100} label="D" />
      </Tuck>,
    )

    expect(['A', 'B', 'C', 'D'].map(isTucked)).toEqual([false, false, true, true])
    // Fragment の中は「Fragment の番号/中の番号」になる
    expect(renderTucked).toHaveBeenLastCalledWith([
      expect.objectContaining({ key: '1/1' }),
      expect.objectContaining({ key: '2' }),
    ])
  })
})
