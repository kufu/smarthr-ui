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
})
