import { act, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { vi } from 'vitest'

import { ListBox } from '../useListbox'

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }

  observe = vi.fn()
  disconnect = vi.fn()
}

const OPTION_COUNT = 250

const buildOptions = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `id-${i}`,
    selected: false,
    isNew: false,
    item: { label: `option${i}`, value: `value-${i}` },
  }))

describe('ListBox - Intersection(スクロール末端検知による追加読み込み)', () => {
  const options = buildOptions(OPTION_COUNT)
  const listBoxRef = createRef<HTMLDivElement>()
  const activeRef = createRef<HTMLButtonElement>()

  beforeEach(() => {
    MockIntersectionObserver.instances = []
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const renderListBox = () =>
    render(
      <ListBox
        listBoxRef={listBoxRef}
        activeRef={activeRef}
        activeOptionId={undefined}
        listBoxId="listbox"
        isExpanded
        listBoxRect={{ top: 0, left: 0 }}
        triggerWidth={100}
        handleAdd={undefined}
        handleHoverOption={() => {}}
        handleSelect={() => {}}
        options={options}
      />,
    )

  const intersect = () => {
    const observer = MockIntersectionObserver.instances.at(-1)!

    act(() => {
      observer.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        observer as unknown as IntersectionObserver,
      )
    })
  }

  it('初期表示は先頭から100件のみで、末尾に監視要素が配置され観測が開始される', () => {
    renderListBox()

    expect(screen.getByText('option99')).toBeInTheDocument()
    expect(screen.queryByText('option100')).not.toBeInTheDocument()

    expect(MockIntersectionObserver.instances).toHaveLength(1)
    expect(MockIntersectionObserver.instances[0].observe).toHaveBeenCalledTimes(1)
  })

  it('監視要素が交差すると表示件数が100件ずつ増える', () => {
    renderListBox()

    intersect()

    expect(screen.getByText('option199')).toBeInTheDocument()
    expect(screen.queryByText('option200')).not.toBeInTheDocument()
  })

  it('全件表示に達すると監視要素が消え、observerがdisconnectされる', () => {
    renderListBox()

    intersect()

    const observerAfterFirstIntersect = MockIntersectionObserver.instances.at(-1)!

    intersect()

    expect(screen.getByText('option249')).toBeInTheDocument()
    expect(observerAfterFirstIntersect.disconnect).toHaveBeenCalledTimes(1)
  })
})
