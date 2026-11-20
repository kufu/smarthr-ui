import { render } from '@testing-library/react'
import { createRef } from 'react'

import { Table } from './Table'

describe('Table', () => {
  test.each([true, false])('reel=%sのときrefがtable要素にアタッチされる', (reel) => {
    const ref = createRef<HTMLTableElement>()

    render(
      <Table ref={ref} reel={reel}>
        <tbody>
          <tr>
            <td>test</td>
          </tr>
        </tbody>
      </Table>,
    )

    expect(ref.current).toBeInstanceOf(HTMLTableElement)
  })

  describe('rounded', () => {
    const renderTable = (props: Partial<Parameters<typeof Table>[0]>) => {
      const ref = createRef<HTMLTableElement>()

      render(
        <Table {...props} ref={ref}>
          <tbody>
            <tr>
              <td>test</td>
            </tr>
          </tbody>
        </Table>,
      )

      return ref.current!.closest('.smarthr-ui-Scroller')!
    }

    test.each([
      [true, 'shr-rounded-l'],
      ['all', 'shr-rounded-l'],
      ['top', 'shr-rounded-t-l'],
      ['right', 'shr-rounded-r-l'],
      ['bottom', 'shr-rounded-b-l'],
      ['left', 'shr-rounded-l-l'],
    ] as const)('rounded=%sのときスクロール領域に%sが付与される', (rounded, className) => {
      expect(renderTable({ rounded })).toHaveClass(className)
    })

    test.each([
      { reel: true, fixedHead: false },
      { reel: false, fixedHead: false },
      { reel: true, fixedHead: true },
      { reel: false, fixedHead: true },
    ])('reel=$reel, fixedHead=$fixedHeadでもスクロール領域に角丸が付与される', (props) => {
      expect(renderTable({ ...props, rounded: true })).toHaveClass('shr-rounded-l')
    })

    test('roundedを指定しないときスクロール領域に角丸が付与されない', () => {
      expect(renderTable({}).className).not.toMatch(/shr-rounded/)
    })
  })
})
